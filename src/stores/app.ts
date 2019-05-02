import { observable, computed, action } from 'mobx'

import $ from 'cafy'

import seaClient from '../util/seaClient'
const SEA_CLIENT_STATE_NAME = 'mozuku::seaClientState'

import { Account, Post, BODYPART_TYPE_BOLD, BODYPART_TYPE_TEXT } from '../models'

class SApp {
  @observable loggedIn: boolean = false
  @observable initialized: boolean = false
  @observable meId!: number

  @observable accounts: Map<number, Account> = new Map()
  @observable posts: Map<number, Post> = new Map()

  @observable timelineIds: number[] = []
  timelinePollingTimeoutId?: number

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

  @computed get timeline () {
    return this.timelineIds.map(id => {
      const p = this.posts.get(id)
      if (!p) throw new Error('なんかおかしい')
      return p
    })
  }
  @action
  async fetchTimeline() {
    const timeline = await seaClient
      .get('/v1/timelines/public')
      .then((p: any) => {
        if (!Array.isArray(p)) throw new Error()
        return p.map((v: any) => $.obj({
          id: $.num
        }).throw(v))
      })
    const news = timeline.filter(
      // prevent to parse same post too many times
      p => !this.timelineIds.includes(p.id)
    ).map(
      // cast to Post model
      p => {
        const post = new Post(p)
        post.body.process([
          // Make bold me
          // これは model に閉じれないのでここにおきます
          (p) => {
            if (p.type !== BODYPART_TYPE_TEXT) {
              return [p]
            }
            if (!this.me) return [p]
            const { screenName } = this.me
            const target = '@' + screenName
            const r = p.payload.split(new RegExp(`(${target})`, 'gi'))
            return r.map((t) => {
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
        ])
        return post
      }
    )
    const newIds = news.map(p => {
      this.posts.set(p.id, p)
      return p.id
    })
    const idsSet = new Set([...newIds, ...this.timelineIds])
    this.timelineIds = Array.from(idsSet.values())
  }
  @action
  startTimelinePolling() {
    const interval = 1000
    const timerFn = () => {
      const p = this.fetchTimeline()
      this.timelinePollingTimeoutId = window.setTimeout(timerFn, interval)
      return p
    }
    return timerFn()
  }
  @action
  stopTimelinePolling() {
    clearTimeout(this.timelinePollingTimeoutId)
    this.timelineIds = []
    this.timelinePollingTimeoutId = undefined
  }
}

export default new SApp()
