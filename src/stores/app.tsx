import { observable } from 'mobx'

import seaClient from '../util/seaClient'
const SEA_CLIENT_STATE_NAME = 'mozuku::seaClientState'

class App {
  @observable loggedIn = false

  constructor() {
    const ss = localStorage.getItem(SEA_CLIENT_STATE_NAME)
    if (ss) {
      seaClient.unpack(ss)
      this.loggedIn = true
    }
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
}

export default new App()
