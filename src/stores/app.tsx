import { observable, IObservableValue, computed } from 'mobx'

import seaClient from '../util/seaClient'
const SEA_CLIENT_STATE_NAME = 'mozuku::seaClientState'

import { Account } from '../models'

class SApp {
  @observable loggedIn = false
  @observable meId: number = 0
  @observable accounts: Map<number, Account> = new Map()

  constructor() {
    const ss = localStorage.getItem(SEA_CLIENT_STATE_NAME)
    if (ss) {
      seaClient.unpack(ss)
      this.loggedIn = true
    }
  }

  @computed get me () {
    return this.meId ? this.accounts.get(this.meId) : undefined
  }


  login() {
    const p = seaClient.pack()
    localStorage.setItem(SEA_CLIENT_STATE_NAME, p)
    this.loggedIn = true
  }
  logout() {
    seaClient.clear()
    localStorage.removeItem(SEA_CLIENT_STATE_NAME)
    this.loggedIn = false
  }
  async loadMe () {
    const me = await seaClient.get('/v1/accounts/my').then((d: any) => new Account(d))
    this.accounts.set(me.id, me)
    this.meId = me.id
  }
}

export default new SApp()
