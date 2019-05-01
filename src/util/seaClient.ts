import $ from 'cafy'
import axios from 'axios'

export class SeaClient {
  private oauth: string
  private clientId: string
  private clientSecret: string

  private api: string
  private token?: string = null
  private tokenType?: string = null

  constructor (oauthRoot: string, apiRoot: string, clientId: string, clientSecret: string) {
    this.oauth = oauthRoot
    this.api = apiRoot
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  get authd () {
    return this.token !== null
  }

  getAuthorizeURL(state: string = '') {
    const authURL = new URL(this.oauth + '/authorize')
    authURL.searchParams.set('state', state)
    authURL.searchParams.set('client_id', this.clientId)
    authURL.searchParams.set('response_type', 'code')
    return authURL.href
  }

  async obtainToken (code: string, state: string = '') {
    const tokenURL = new URL(this.oauth + '/token')
    const form = new URLSearchParams()
    form.set('client_id', this.clientId)
    form.set('client_secret', this.clientSecret)
    form.set('code', code)
    form.set('state', state)
    form.set('grant_type', 'authorization_code')

    const token = await fetch(tokenURL.href, {
      method: 'POST',
      body: form,
    }).then(r => r.json()).then((r) => {
      return $.obj({
        token_type: $.str,
        access_token: $.str,
      }).strict().throw(r)
    })
    this.token = token.access_token
    this.tokenType = token.token_type
  }

  private createAxiosInstance () {
    return axios.create({
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        'Content-Type': 'application/json'
      }
    })
  }

  private genApiHref (path) {
    const url = new URL(this.api + path)
    url.pathname.replace(/\/+/g, '/')
    return url.href
  }

  get (path: string) {
    return this.createAxiosInstance().get(this.genApiHref(path)).then(r => r.data)
  }

  post (path: string, data: any) {
    return this.createAxiosInstance().post(this.genApiHref(path), { data }).then(r => r.data)
  }
}

import Config from '../config'
export default new SeaClient(Config.oauth, Config.api, Config.app.id, Config.app.secret)
