import { observable, computed, action } from 'mobx'

import $ from 'cafy'
import moment from 'moment'

import seaClient from '../util/seaClient'
const SEA_CLIENT_STATE_NAME = 'mozuku::seaClientState'

import {
  Account,
  Post,
  BODYPART_TYPE_BOLD,
  BODYPART_TYPE_TEXT
} from '../models'
import { PostBodyPart } from '../models/post';

class SApp {
  readonly defaultTitle = 'Mozuku'

  @observable hidden = document.hidden
  setHidden (hidden: boolean) {
    this.hidden = hidden
    if (!hidden) {
      this.timelineInBackgroundCnt = 0
    }
  }

  @observable loggedIn: boolean = false
  @observable initialized: boolean = false

  @observable accounts: Map<number, Account> = new Map()
  @observable posts: Map<number, Post> = new Map()

  @observable meId!: number
  @computed get me() {
    return this.meId ? this.accounts.get(this.meId) : undefined
  }

  @observable timelineIds: number[] = []
  @observable private timelineInBackgroundCnt: number = 0
  @observable private timelineStreamDisconnected = false
  private timelineStream?: WebSocket
  private timelineStreamPilotTimerId?: number
  private timelineStreamLastPingSeen?: Date
  @computed get timeline() {
    return this.timelineIds.map(id => {
      const p = this.posts.get(id)
      if (!p) throw new Error('なんかおかしい')
      return p
    })
  }
  @computed get timelineTitle () {
    let title = 'Mozuku'
    if (this.hidden && this.timelineInBackgroundCnt) {
      title = `(${this.timelineInBackgroundCnt}) ${this.timeline[0].text}`
    }
    const status = this.timelineStreamDisconnected ? '🌩️' : '⚡️'
    return status + title
  }

  constructor() {
    const ss = localStorage.getItem(SEA_CLIENT_STATE_NAME)
    if (ss) {
      seaClient.unpack(ss)
      this.loggedIn = true
    }
  
    window.addEventListener('visibilitychange', () => {
      this.setHidden(document.hidden)
    })
  }

  @action
  login() {
    const p = seaClient.pack()
    localStorage.setItem(SEA_CLIENT_STATE_NAME, p)
    this.loggedIn = true
  }
  @action
  logout() {
    seaClient.clear()
    localStorage.removeItem(SEA_CLIENT_STATE_NAME)
    this.loggedIn = false
  }

  async init() {
    const me = await seaClient
      .get('/v1/account/verify_credentials')
      .then((d: any) => new Account(d))
    this.accounts.set(me.id, me)
    this.meId = me.id
    this.initialized = true
  }

  @action
  resetTimeline() {
    this.timelineIds = []
    this.timelineStreamLastPingSeen = undefined
    if (this.timelineStreamPilotTimerId) {
      clearTimeout(this.timelineStreamPilotTimerId)
      this.timelineStreamPilotTimerId = undefined
    }
    this.timelineStreamDisconnected = false
  }
  private async addPosts(ps: any[]) {
    // Make bold me
    const boldMyScreenNameMiddleware = (a: Account) => (p: PostBodyPart): PostBodyPart[] => {
      if (p.type !== BODYPART_TYPE_TEXT) {
        return [p]
      }
      const { screenName } = a
      const target = '@' + screenName
      const r = p.payload.split(new RegExp(`(${target})`, 'gi'))
      return r.map(t => {
        if (t === target) {
          return {
            type: BODYPART_TYPE_BOLD,
            payload: t
          }
        }
        return {
          type: BODYPART_TYPE_TEXT,
          payload: t
        }
      })
    }

    // cast to post
    const pms = await Promise.all(ps.map(async (p: any) => new Post(p)))
    // custom process for domain
    const posts = await Promise.all(pms.map(post => {
      // model に閉じれない物をここにおきます
      if (!this.me) return post // ほとんどの場合ありえない (呼び出しタイミングを考えると)
      post.body.process([
        boldMyScreenNameMiddleware(this.me)
      ])
      return post
    }))
    posts.forEach(p => {
      this.posts.set(p.id, p)
    })
    return posts
  }
  private async unshiftTimeline (...p: any[]) {
    // filter only ids that not seen: おそらく結構 Post のバリデーションが重たいので効率化のため
    const pp = p.map((p: any) => $.obj({ id: $.num }).throw(p))
    const fpp = pp.filter(p => !this.timelineIds.includes(p.id))

    const ids = await this.addPosts(fpp).then(ps => ps.map(p => p.id))
    // for safety: 上記 addPosts を読んでいる間に更新がされてた場合ちゃんと
    // 同じ投稿が1回のみタイムラインに表示される世界になってない可能性がある
    const idsSet = new Set([...ids, ...this.timelineIds])

    const tc = this.timelineIds.length
    this.timelineIds = Array.from(idsSet.values())

    // 先頭に追加の時だけ count up
    if (this.hidden) this.timelineInBackgroundCnt += idsSet.size - tc
  }
  private async pushTimeline (...p: any[]) {
    const pp = p.map((p: any) => $.obj({ id: $.num }).throw(p))
    const fpp = pp.filter(p => !this.timelineIds.includes(p.id))

    const ids = await this.addPosts(fpp).then(ps => ps.map(p => p.id))
    const idsSet = new Set([...this.timelineIds, ...ids])
    this.timelineIds = Array.from(idsSet.values())
  }
  @action
  async fetchTimeline() {
    const timeline = await seaClient
      .get('/v1/timelines/public?count=10')
      .then((tl: any) => {
        if (!Array.isArray(tl)) throw new Error('?')
        return tl
      })
    this.unshiftTimeline(...timeline)
  }
  @action
  async readMoreTimeline() {
    if (this.timelineIds.length >= 100) return alert('これ以上は動かないよ!')
    // after query 実装するまでは count=100 で誤魔化す
    const timeline = await seaClient
      .get('/v1/timelines/public?count=100')
      .then((tl: any) => {
        if (!Array.isArray(tl)) throw new Error('?')
        return tl
      })
    this.pushTimeline(...timeline)  
  }
  private enablePilotTimelineStream () {
    if (this.timelineStreamPilotTimerId) return
    const interval = 1000 * 15
    const reconnect = async () => {
      this.closeTimelineStream()
      // memo: 接続性チェックも含む
      await this.fetchTimeline()
      await this.openTimelineStream()
    }
    const pilot = async () => {
      try {
        if (this.timelineStreamDisconnected) {
          await reconnect()
        }

        if (!this.timelineStreamDisconnected) {
          const sec = moment().diff(this.timelineStreamLastPingSeen, 'second')
          if (sec > 60) {
            this.timelineStreamDisconnected = true
            await reconnect()
          }
        }

        // send ping from client if stream was alive
        if (this.timelineStream) {
          this.timelineStream.send(JSON.stringify({
            type: 'ping'
          }))
        }
      } catch(e) {
        console.error(e)
      } finally {
        // NO MORE 2重起動
        this.timelineStreamPilotTimerId = window.setTimeout(pilot, interval)
      }
    }
    // enable it
    this.timelineStreamPilotTimerId = window.setTimeout(pilot, interval)
  }
  async openTimelineStream() {
    const stream = await seaClient.connectStream('v1/timelines/public')

    // for reconnecting
    this.timelineStreamDisconnected = false
    this.enablePilotTimelineStream()
    this.timelineStreamLastPingSeen = new Date()
    // internal state
    this.timelineStream = stream

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
          this.timelineStreamLastPingSeen = new Date()
          return
        }
        // It's post EXACTLY! YEAH
        this.unshiftTimeline(m.content)
      } catch (e) {
        console.error(e)
      }
    })
    stream.addEventListener('close', () => {
      this.timelineStreamDisconnected = true
    })
  }
  closeTimelineStream() {
    if (!this.timelineStream) return
    const ws = this.timelineStream
    if (![WebSocket.CLOSING, WebSocket.CLOSED].includes(ws.readyState)) {
      ws.close()
    }
    this.timelineStream = undefined
    this.timelineStreamDisconnected = true
  }
}

export default new SApp()
