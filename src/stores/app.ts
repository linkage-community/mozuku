import { observable, computed, action } from 'mobx'

import seaClient from '../util/seaClient'
const SEA_CLIENT_STATE_NAME = 'mozuku::seaClientState'

import { Account, Post } from '../models'

class SApp {
  @observable loggedIn: boolean = false
  @observable meId?: number
  @observable accounts: Map<number, Account> = new Map()
  @observable timeline: Post[] = []
  timelinePollingTimeoutId?: number

  constructor() {
    const ss = localStorage.getItem(SEA_CLIENT_STATE_NAME)
    if (ss) {
      seaClient.unpack(ss)
      this.loggedIn = true
    }

    this.meId
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
  async loadMe() {
    const me = await seaClient
      .get('/v1/account/verify_credentials')
      .then((d: any) => new Account(d))
    this.accounts.set(me.id, me)
    this.meId = me.id
  }

  @action
  async fetchTimeline() {
    const timeline = await seaClient
      .get('/v1/timelines/public')
      .then((p: any) => {
        if (!Array.isArray(p)) throw new Error()
        return p.map((v: any) => new Post(v))
      })
    this.timeline = timeline
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
    this.timeline = []
    this.timelinePollingTimeoutId = undefined
  }
}

export default new SApp()
