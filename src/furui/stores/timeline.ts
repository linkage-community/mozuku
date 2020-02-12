import { useEffect } from 'react'

import { observable, computed, action } from 'mobx'

import $ from 'cafy'
import { differenceInSeconds } from 'date-fns'

import app, {
  PREFERENCE_NOTICE_WHEN_MENTIONED,
  PREFERENCE_MUTE_COMPUTED_APP
} from './app'

import seaAPI from '../../sea-api'
import { Post } from '../models'

// @ts-ignore
import favicon from '../../static/favicon.png'
// @ts-ignore
import faviconActive from '../../static/favicon_active.png'

import { isMention } from '@linkage-community/bottlemail'

type TimelineStoreDeps = {
  onHiddenChange: (callback: (hidden: boolean) => void) => void
}

class TimelineStore {
  @observable postIds: number[] = []
  @observable private unreadCount: number = 0
  @observable private _hidden = app.hidden
  @computed
  private get connectedAndBackground() {
    return this._hidden && this.streamConnected
  }
  @observable private streamConnected = false
  private stream?: WebSocket
  private streamPilot?: number
  private streamLastPingFromServer?: Date
  private get notificationEnabled() {
    return app.getPreference(PREFERENCE_NOTICE_WHEN_MENTIONED)
  }
  private shouldMute(p: Post) {
    if (!app.getPreference(PREFERENCE_MUTE_COMPUTED_APP)) return false
    if (p.application.isAutomated) return true
    return false
  }

  constructor({ onHiddenChange }: TimelineStoreDeps) {
    onHiddenChange(hidden => {
      if (!hidden) {
        // reset counter
        this.unreadCount = 0
        this._hidden = false
        return
      }
      this._hidden = true
    })
  }
  private countUnread(posts: Post[]) {
    if (!this.connectedAndBackground) return
    this.unreadCount += posts.filter(p => !this.shouldMute(p)).length
  }

  @computed get posts() {
    return this.postIds
      .map(id => {
        const p = app.posts.get(id)
        if (!p) throw new Error('なんかおかしい')
        if (this.shouldMute(p)) return
        return p
      })
      .filter(p => !!p) as Post[]
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

  @computed get icon() {
    return this.unreadCount ? faviconActive : favicon
  }

  @action
  reset() {
    if (this.streamPilot) {
      clearTimeout(this.streamPilot)
      this.streamPilot = undefined
    }
    this.postIds = []
    this.streamLastPingFromServer = undefined
    this.streamConnected = false
  }
  @action
  private async unshift(...p: any[]) {
    // filter only ids that not seen: おそらく結構 Post のバリデーションが重たいので効率化のため
    const pp = p.map((p: any) => $.obj({ id: $.num }).throw(p))
    const fpp = pp.filter(p => !this.postIds.includes(p.id))

    const posts = await app.setPosts(fpp)
    const ids = posts.map(p => p.id)
    // for safety: 上記 addPosts を読んでいる間に更新がされてた場合ちゃんと
    // 同じ投稿が1回のみタイムラインに表示される世界になってない可能性がある
    const idsSet = new Set([...ids, ...this.postIds])

    const tc = this.postIds.length
    this.postIds = Array.from(idsSet.values())

    this.countUnread(posts)
    this.showNotification(posts)
  }
  @action
  private async push(...p: any[]) {
    const pp = p.map((p: any) => $.obj({ id: $.num }).throw(p))
    const fpp = pp.filter(p => !this.postIds.includes(p.id))

    const ids = await app.setPosts(fpp).then(ps => ps.map(p => p.id))
    const idsSet = new Set([...this.postIds, ...ids])
    this.postIds = Array.from(idsSet.values())
  }

  async fetch({
    sinceId,
    count = 30
  }: { sinceId?: number; count?: number } = {}) {
    const query = new URLSearchParams()
    query.set('count', count.toString(10))
    if (sinceId) query.set('sinceId', sinceId.toString(10))

    const timeline = await seaAPI
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
      const query = new URLSearchParams()
      if (this.postIds.length)
        query.set('maxId', this.postIds[this.postIds.length - 1].toString(10))
      const timeline = await seaAPI
        .get('/v1/timelines/public' + `?${query.toString()}`)
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
    return this._readingMore
  }

  enableNotification(): Promise<void> {
    if (Notification.permission === 'denied') return Promise.reject()
    if (Notification.permission === 'granted') {
      app.setPreference(PREFERENCE_NOTICE_WHEN_MENTIONED, true)
      return Promise.resolve()
    }
    if (Notification.permission !== 'default') {
      console.error(Notification.permission)
      throw new Error('どういうことかわかりません...')
    }
    return new Promise((resolve, reject) => {
      Notification.requestPermission(status => {
        if (status === 'denied' || status === 'default') return reject()
        app.setPreference(PREFERENCE_NOTICE_WHEN_MENTIONED, true)
        return resolve()
      })
    })
  }
  disableNotification() {
    app.setPreference(PREFERENCE_NOTICE_WHEN_MENTIONED, false)
  }
  showNotification(pp: Post[]) {
    if (!this.notificationEnabled || !this.connectedAndBackground) return
    pp.forEach(p => {
      if (!p.nodes.some(n => isMention(n) && n.value === app.me!.screenName))
        return
      const n = new Notification(
        `${p.author.name} (@${p.author.screenName}) mentioned you`,
        {
          body: p.nodes
            .filter(n => !isMention(n))
            .map(p => p.value)
            .join('')
            .trim(),
          icon: p.author.avatarFile
            ? p.author.avatarFile.thumbnail.url.href
            : undefined
        }
      )
      n.addEventListener('click', () => window.focus())
    })
  }
  private enableStreamPilot() {
    if (this.streamPilot) return
    const interval = 1000
    const reconnect = async () => {
      this.closeStream()
      // memo: 接続性チェックも含む
      const latest = this.posts[0]
      const kwargs = latest ? { sinceId: latest.id } : undefined
      await app.fetchMe()
      await this.openStream()
      await this.fetch(kwargs)
    }
    const pilot = async () => {
      try {
        if (!this.streamConnected) {
          await reconnect()
        }

        let reconnectRequired = false
        if (this.streamConnected) {
          const sec = differenceInSeconds(
            new Date(),
            this.streamLastPingFromServer || new Date()
          )
          if (sec > 60) {
            reconnectRequired = true
          }
        }
        if (!window.navigator.onLine) {
          reconnectRequired = true
        }
        // send ping from client if stream was alive
        if (this.stream) {
          this.stream.send(
            JSON.stringify({
              type: 'ping'
            })
          )
        }

        if (reconnectRequired) {
          this.streamConnected = false
          await reconnect()
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
    const stream = await seaAPI.connectStream('v1/timelines/public')
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

const timeline = new TimelineStore({
  onHiddenChange: app.subscribeHiddenChange.bind(app)
})
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
