import { observable, computed, action } from 'mobx'

import $ from 'cafy'

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
  @observable loggedIn: boolean = false
  @observable initialized: boolean = false
  @observable meId!: number

  @observable accounts: Map<number, Account> = new Map()
  @observable posts: Map<number, Post> = new Map()

  timelineSocketRequested = false
  @observable timelineIds: number[] = []

  timelineStream?: WebSocket

  constructor() {
    const ss = localStorage.getItem(SEA_CLIENT_STATE_NAME)
    if (ss) {
      seaClient.unpack(ss)
      this.loggedIn = true
    }
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

  @computed get me() {
    return this.meId ? this.accounts.get(this.meId) : undefined
  }
  async init() {
    const me = await seaClient
      .get('/v1/account/verify_credentials')
      .then((d: any) => new Account(d))
    this.accounts.set(me.id, me)
    this.meId = me.id
    this.initialized = true
  }

  @computed get timeline() {
    return this.timelineIds.map(id => {
      const p = this.posts.get(id)
      if (!p) throw new Error('なんかおかしい')
      return p
    })
  }
  @action
  resetTimeline() {
    this.timelineSocketRequested = false
    this.timelineIds = []
  }
  private processPostBody(post: Post) {
    // model に閉じれない物をここにおきます
    // Make bold me
    const boldScreenNameMiddleware = (a: Account) => (p: PostBodyPart): PostBodyPart[] => {
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
    if (!this.me) return post
    post.body.process([
      boldScreenNameMiddleware(this.me)
    ])
    return post
  }
  private async addPostsToTimeline (...p: any[]) {
    const pp = p.map((p: any) => $.obj({ id: $.num }).throw(p))
    // filter only ids that not seen
    const fpp = pp.filter(p => !this.timelineIds.includes(p.id))
    // cast to post
    const pms = await Promise.all(fpp.map(async (p: any) => new Post(p)))
    // custom process for domain
    const posts = await Promise.all(pms.map(p => this.processPostBody(p)))
    const newIds = posts.map(p => {
      this.posts.set(p.id, p)
      return p.id
    })
    const idsSet = new Set([...newIds, ...this.timelineIds])
    this.timelineIds = Array.from(idsSet.values())
  }
  async resumeTimeline() {
    try {
      await this.fetchTimeline()
      await this.openTimelineSocket()
    } catch (e) {
      console.error(e)
      // keep trying to reconnect...
      window.setTimeout(this.resumeTimeline.bind(this), 1000)
    }
  }
  @action
  async fetchTimeline() {
    const timeline = await seaClient
      .get('/v1/timelines/public')
      .then((tl: any) => {
        if (!Array.isArray(tl)) throw new Error('?')
        return tl
      })
    this.addPostsToTimeline(...timeline)
  }
  async openTimelineSocket() {
    if (this.timelineStream) return
    this.timelineSocketRequested = true

    const ws = await seaClient.connectStream('v1/timelines/public')
    ws.addEventListener('message', ev => {
      try {
        const m = $.obj({
          type: $.str.or(['success', 'error', 'message']),
          message: $.optional.str,
          content: $.optional.obj({})
        }).throw(JSON.parse(ev.data))
        if (m.type === 'success') return
        if (m.type === 'error') throw new Error(m.message)
        // It's post EXACTLY! YEAH
        this.addPostsToTimeline(m.content)
      } catch (e) {
        console.error(e)
      }
    })
    ws.addEventListener('error', ev => {
      console.error(ev)
      this.closeTimelineSocket()
      // reconnect...
      window.setTimeout(this.resumeTimeline.bind(this), 1000)
    })
    this.timelineStream = ws
  }
  closeTimelineSocket() {
    if (!this.timelineStream) return
    if (![WebSocket.CLOSING, WebSocket.CLOSED].includes(this.timelineStream.readyState))
      this.timelineStream.close()

    this.timelineStream = undefined
  }
}

export default new SApp()
