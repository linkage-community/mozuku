import { observable, computed, action } from 'mobx'

import seaAPI from '../../sea-api'
const KEYS = Object.freeze({
  SEA_CLIENT_PACK: 'mozuku::seaClientState',
  SAPP_CACHE_BROKEN: 'mozuku::stores::App',
  SAPP_PREFERENCE: 'Mozuku::AppPreference'
})

export const PREFERENCE_DISPLAY_META_ENABLED = 'PREFERENCE_SHOW_META'
export const PREFERENCE_NOTICE_WHEN_MENTIONED =
  'PREFERENCE_NOTICE_WHEN_MENTIONED'
export const PREFERENCE_DISPLAY_OGCARD = 'PREFERENCE_SHOW_OGCARD'
export const PREFERENCE_FORCE_DARK_THEME = 'PREFERENCE_FORCE_DARK_THEME'
export const PREFERENCE_MUTE_COMPUTED_APP = 'PREFERENCE_MUTE_COMPUTED_APP'
type PREFERENCE_KEYS =
  | typeof PREFERENCE_DISPLAY_META_ENABLED
  | typeof PREFERENCE_NOTICE_WHEN_MENTIONED
  | typeof PREFERENCE_DISPLAY_OGCARD
  | typeof PREFERENCE_FORCE_DARK_THEME
  | typeof PREFERENCE_MUTE_COMPUTED_APP

import { Account, Post, AlbumFile } from '../models'

class SApp {
  readonly defaultTitle = 'Mozuku'

  @observable hidden = document.hidden
  private setHidden(hidden: boolean) {
    this.hidden = hidden
    this.hiddenListener.forEach(fn => fn(hidden))
  }
  private hiddenListener: ((h: boolean) => void)[] = []
  subscribeHiddenChange(callback: (h: boolean) => void) {
    // TODO: あとで unsubscribe いるかも
    this.hiddenListener.push(callback)
  }

  @observable loggedIn: boolean = false
  @observable initialized: boolean = false

  @observable accounts: Map<number, Account> = new Map()
  @observable posts: Map<number, Post> = new Map()
  wrapPostWithLatestAccount(p: Post) {
    return new Proxy(p, {
      get: (post, fieldName: keyof Post) => {
        // Use app's accounts (maybe new)
        if (fieldName === 'author')
          return this.accounts.get(post.author.id) || post[fieldName]
        return post[fieldName]
      }
    })
  }

  @observable private _preferences: Map<PREFERENCE_KEYS, boolean> = new Map()

  @observable meId!: number
  @computed get me() {
    return this.meId ? this.accounts.get(this.meId) : undefined
  }

  migrateState() {
    localStorage.removeItem(KEYS.SAPP_CACHE_BROKEN)
  }
  loadClient() {
    const ss = localStorage.getItem(KEYS.SEA_CLIENT_PACK)
    if (ss) {
      seaAPI.unpack(ss)
      this.loggedIn = true
    }
  }

  constructor() {
    this.migrateState()
    this.loadClient()
    this.loadPreferences()

    window.addEventListener('visibilitychange', () => {
      this.setHidden(document.hidden)
    })

    if (this.getPreference(PREFERENCE_FORCE_DARK_THEME)) {
      this.enableForceDarkTheme()
    }
  }
  @action
  login() {
    const p = seaAPI.pack()
    localStorage.setItem(KEYS.SEA_CLIENT_PACK, p)
    this.loggedIn = true
  }
  @action
  logout() {
    seaAPI.clear()
    localStorage.removeItem(KEYS.SEA_CLIENT_PACK)
    this.loggedIn = false
  }

  @computed
  get getPreference(): (key: PREFERENCE_KEYS) => boolean {
    // FIXME: yokunaine
    // MobX は getter にしか computed を付与できないので
    // > @computed
    // > getPreference(key: PREFERENCE_KEYS): boolean
    // ができなかった
    return (key: PREFERENCE_KEYS) => this._preferences.get(key) || false
  }
  @action
  setPreference(key: PREFERENCE_KEYS, value: boolean) {
    this._preferences.set(key, value)
    this.savePreferences()
    return
  }
  savePreferences() {
    localStorage.setItem(
      KEYS.SAPP_PREFERENCE,
      JSON.stringify(Array.from(this._preferences))
    )
  }
  loadPreferences() {
    const p = localStorage.getItem(KEYS.SAPP_PREFERENCE)
    if (p) {
      const pp = JSON.parse(p)
      this._preferences = new Map(pp)
    }
  }
  fetchMe() {
    return seaAPI.get('/v1/account').then((d: any) => new Account(d))
  }

  async init() {
    try {
      const me = await this.fetchMe()
      this.accounts.set(me.id, me)
      this.meId = me.id
      this.initialized = true
    } catch (e) {
      alert('Check sea. You will be logged-out.')
      console.error(e)
      this.logout()
    }
  }

  async setAccounts(as: any[]) {
    const accounts = as.map(a => new Account(a))
    accounts.forEach(a => {
      this.accounts.set(a.id, a)
    })
    return accounts
  }
  async setPosts(ps: any[]) {
    // cast to post
    const posts = await Promise.all(ps.map(async (p: any) => new Post(p)))
    posts.map(p => p.author).forEach(a => this.accounts.set(a.id, a))
    posts.forEach(p => this.posts.set(p.id, this.wrapPostWithLatestAccount(p)))
    return posts
  }

  @observable isUploading: boolean = false

  @action
  setIsUploading(b: boolean) {
    this.isUploading = b
  }

  // FIXME: これいる?
  async uploadAlbumFile(
    name: string,
    blob: Blob,
    state: ((p: number) => void) | null = null
  ): Promise<AlbumFile> {
    const r = await seaAPI.uploadAlbumFile(name, blob, state)
    return new AlbumFile(r)
  }

  enableForceDarkTheme() {
    // head
    document.firstElementChild!.setAttribute('class', 'dark-theme-enabled')
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', '#000')
  }

  disableForceDarkTheme() {
    document.firstElementChild!.removeAttribute('class')
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', '#1ba9cc')
  }
}

const app = new SApp()
export default app
