import $ from 'cafy'
import axios from 'axios'

export class SeaClient {
  private oauth: string
  private clientId: string
  private clientSecret: string
  private api: string

  private token?: string
  private tokenType?: string

  constructor(
    oauthRoot: string,
    apiRoot: string,
    clientId: string,
    clientSecret: string
  ) {
    this.oauth = oauthRoot
    this.api = apiRoot
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  clear() {
    this.token = undefined
    this.tokenType = undefined
  }
  pack() {
    return JSON.stringify({ tokenType: this.tokenType, token: this.token })
  }
  unpack(s: string) {
    const { tokenType, token } = $.obj({
      token: $.str,
      tokenType: $.str
    }).throw(JSON.parse(s))
    this.token = token
    this.tokenType = tokenType
  }

  get authd() {
    return !!this.token
  }

  getAuthorizeURL(state: string) {
    const authURL = new URL(this.oauth + '/authorize')
    authURL.searchParams.set('state', state)
    authURL.searchParams.set('client_id', this.clientId)
    authURL.searchParams.set('response_type', 'code')
    return authURL.href
  }

  async obtainToken(code: string, state: string) {
    const tokenURL = new URL(this.oauth + '/token')
    const form = new URLSearchParams()
    form.set('client_id', this.clientId)
    form.set('client_secret', this.clientSecret)
    form.set('code', code)
    form.set('state', state)
    form.set('grant_type', 'authorization_code')

    const token = await fetch(tokenURL.href, {
      method: 'POST',
      body: form
    })
      .then(r => r.json())
      .then(r => {
        return $.obj({
          token_type: $.str,
          access_token: $.str
        })
          .strict()
          .throw(r)
      })
    this.token = token.access_token
    this.tokenType = token.token_type
  }

  private createAxiosInstance() {
    return axios.create({
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        'Content-Type': 'application/json'
      }
    })
  }

  private genApiHref(path: string) {
    const url = new URL(this.api + path)
    url.pathname.replace(/\/+/g, '/')
    return url.href
  }

  get(path: string) {
    return this.createAxiosInstance()
      .get(this.genApiHref(path))
      .then(r => r.data)
  }

  post(path: string, data: any) {
    return this.createAxiosInstance()
      .post(this.genApiHref(path), data)
      .then(r => r.data)
  }

  patch(path: string, data: any) {
    return this.createAxiosInstance()
      .patch(this.genApiHref(path), data)
      .then(r => r.data)
  }

  async uploadAlbumFile(name: string, blob: Blob): Promise<any> {
    const form = new FormData()
    form.append('file', blob)
    form.append('name', name)
    form.append('ifNameConflicted', 'add-date-string')

    const path = '/v1/album/files'
    return this.createAxiosInstance()
      .post(this.genApiHref(path), form)
      .then(r => r.data)
  }

  connectStream(stream: string): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      try {
        const error = (e: Event) => {
          return reject(e)
        }
        const close = (e: Event) => {
          return reject(e)
        }
        const once = (ev: MessageEvent) => {
          w.removeEventListener('message', once)
          w.removeEventListener('error', error)
          w.removeEventListener('close', close)
          try {
            const raw = JSON.parse(ev.data)
            const data = $.obj({
              type: $.str
            }).throw(raw)
            if (data.type === 'success') {
              return resolve(w)
            }
          } catch (e) {
            return reject(e)
          }
          reject()
        }

        const w = new WebSocket(
          this.api.replace('https://', 'wss://').replace('http://', 'ws://')
        )
        // send handshake
        w.addEventListener('open', () => {
          w.send(
            JSON.stringify({
              type: 'connect',
              stream,
              token: this.token
            })
          )
        })
        w.addEventListener('message', once)
        w.addEventListener('error', error)
        w.addEventListener('close', close)
      } catch (e) {
        reject(e)
      }
    })
  }
}

import Config from '../config'
export default new SeaClient(
  Config.oauth,
  Config.api,
  Config.app.id,
  Config.app.secret
)
