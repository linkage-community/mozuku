import { useEffect } from 'react'

import { observable, computed, action } from 'mobx'

import $ from 'cafy'
import moment from 'moment'

import app from './app'

import seaClient from '../util/seaClient'

class TimelineStore {
  @observable ids: number[] = []
  @observable private unreadCount: number = 0
  private _hidden = false
  private get connectedAndBackground() {
    return this._hidden && this.streamConnected
  }
  @observable private streamConnected = false
  private stream?: WebSocket
  private streamPilot?: number
  private streamLastPingFromServer?: Date

  constructor() {
    app.subscribeHiddenChange(hidden => {
      if (!hidden) {
        // reset counter
        this.unreadCount = 0
        this._hidden = false
        return
      }
      this._hidden = true
    })
  }
  private countUnread(cnt: number) {
    if (!this.connectedAndBackground) return
    this.unreadCount += cnt
  }

  @computed get timeline() {
    return this.ids.map(id => {
      const p = app.posts.get(id)
      if (!p) throw new Error('なんかおかしい')
      return p
    })
  }
  @computed get title() {
    return [
      this.streamConnected ? '⚡️' : '🌩️',
      ...(this.connectedAndBackground && this.unreadCount
        ? [`(${this.unreadCount})`]
        : []),
      app.defaultTitle
    ].join(' ')
  }

  @action
  reset() {
    if (this.streamPilot) {
      clearTimeout(this.streamPilot)
      this.streamPilot = undefined
    }
    this.ids = []
    this.streamLastPingFromServer = undefined
    this.streamConnected = false
  }
  @action
  private async unshift(...p: any[]) {
    // filter only ids that not seen: おそらく結構 Post のバリデーションが重たいので効率化のため
    const pp = p.map((p: any) => $.obj({ id: $.num }).throw(p))
    const fpp = pp.filter(p => !this.ids.includes(p.id))

    const ids = await app.setPosts(fpp).then(ps => ps.map(p => p.id))
    // for safety: 上記 addPosts を読んでいる間に更新がされてた場合ちゃんと
    // 同じ投稿が1回のみタイムラインに表示される世界になってない可能性がある
    const idsSet = new Set([...ids, ...this.ids])

    const tc = this.ids.length
    this.ids = Array.from(idsSet.values())

    this.countUnread(idsSet.size - tc)
  }
  @action
  private async push(...p: any[]) {
    const pp = p.map((p: any) => $.obj({ id: $.num }).throw(p))
    const fpp = pp.filter(p => !this.ids.includes(p.id))

    const ids = await app.setPosts(fpp).then(ps => ps.map(p => p.id))
    const idsSet = new Set([...this.ids, ...ids])
    this.ids = Array.from(idsSet.values())
  }

  async fetch({
    sinceId,
    count = 30
  }: { sinceId?: number; count?: number } = {}) {
    const query = new URLSearchParams()
    query.set('count', count.toString(10))
    if (sinceId) query.set('sinceId', sinceId.toString(10))

    const timeline = await seaClient
      .get('/v1/timelines/public?' + query.toString())
      .then((tl: any) => {
        if (!Array.isArray(tl)) throw new Error('?')
        return tl
      })
    this.unshift(...timeline)
  }
  async readMore() {
    if (this.readMoreDisabled) return alert('これ以上は動かないよ!')
    try {
      this._readingMore = true
      // after query 実装するまでは count=100 で誤魔化す
      const timeline = await seaClient
        .get('/v1/timelines/public?count=100')
        .then((tl: any) => {
          if (!Array.isArray(tl)) throw new Error('?')
          return tl
        })
      this.push(...timeline)
    } catch (e) {
      throw e
    } finally {
      this._readingMore = false
    }
  }
  @observable _readingMore = false
  @computed
  get readMoreDisabled() {
    return this._readingMore || this.ids.length === 0 || this.ids.length >= 100 // temp: after query 実装するまで
  }

  private enableStreamPilot() {
    if (this.streamPilot) return
    const interval = 1000 * 15
    const reconnect = async () => {
      this.closeStream()
      // memo: 接続性チェックも含む
      const kwargs = this.timeline[0]
        ? { sinceId: this.timeline[0].id }
        : undefined
      await this.fetch(kwargs)
      await this.openStream()
    }
    const pilot = async () => {
      try {
        if (!this.streamConnected) {
          await reconnect()
        }

        if (this.streamConnected) {
          const sec = moment().diff(this.streamLastPingFromServer, 'second')
          if (sec > 60) {
            this.streamConnected = false
            await reconnect()
          }
        }

        // send ping from client if stream was alive
        if (this.stream) {
          this.stream.send(
            JSON.stringify({
              type: 'ping'
            })
          )
        }
      } catch (e) {
        console.error(e)
      } finally {
        // NO MORE 2重起動
        this.streamPilot = window.setTimeout(pilot, interval)
      }
    }
    // enable it
    this.streamPilot = window.setTimeout(pilot, interval)
  }
  async openStream() {
    const stream = await seaClient.connectStream('v1/timelines/public')
    this.streamConnected = true
    this.stream = stream
    // for reconnecting
    this.enableStreamPilot()
    this.streamLastPingFromServer = new Date()

    stream.addEventListener('message', ev => {
      try {
        const m = $.obj({
          type: $.str.or(['success', 'error', 'message', 'ping']),
          message: $.optional.str,
          content: $.optional.obj({})
        }).throw(JSON.parse(ev.data))
        if (m.type === 'success') return
        if (m.type === 'error') throw new Error(m.message)
        if (m.type === 'ping') {
          this.streamLastPingFromServer = new Date()
          return
        }
        // It's post EXACTLY! YEAH
        this.unshift(m.content)
      } catch (e) {
        console.error(e)
      }
    })
    stream.addEventListener('close', () => {
      this.streamConnected = false
    })
  }
  closeStream() {
    if (!this.stream) return
    const ws = this.stream
    if (![WebSocket.CLOSING, WebSocket.CLOSED].includes(ws.readyState)) {
      ws.close()
    }
    this.stream = undefined
    this.streamConnected = false
  }
}

const timeline = new TimelineStore()
export default timeline

export const useTimeline = () =>
  useEffect(() => {
    let openTimerID: number
    const open = async () => {
      class NotReady {}
      try {
        // FIXME: 汚い.....
        if (!app.initialized) throw new NotReady()
        await timeline.fetch()
        await timeline.openStream()
      } catch (e) {
        if (e instanceof NotReady) {
          window.setTimeout(open, 100)
          return
        }
        console.error(e)
        window.setTimeout(open, 500)
      }
    }
    open()
    return () => {
      document.title = app.defaultTitle
      if (openTimerID) window.clearTimeout(openTimerID)
      timeline.reset()
      timeline.closeStream()
    }
  }, [])
