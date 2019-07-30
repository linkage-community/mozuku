import { useEffect } from 'react'

import { observable, computed, action } from 'mobx'

import seaClient from '../util/seaClient'
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
type PREFERENCE_KEYS =
  | typeof PREFERENCE_DISPLAY_META_ENABLED
  | typeof PREFERENCE_NOTICE_WHEN_MENTIONED
  | typeof PREFERENCE_DISPLAY_OGCARD
  | typeof PREFERENCE_FORCE_DARK_THEME

import {
  Account,
  Post,
  NewBoldMyScreenNameMiddleware,
  pruneEmptyTextMiddleware
} from '../models'
import AlbumFile from '../models/AlbumFile'

export type ShortcutFn = (ev: KeyboardEvent) => void

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

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

  @observable preferences: Map<PREFERENCE_KEYS, boolean> = new Map()

  @observable meId!: number
  @computed get me() {
    return this.meId ? this.accounts.get(this.meId) : undefined
  }
  private shortcuts: Map<number, ShortcutFn> = new Map()
  addShortcut(charCode: number, callback: ShortcutFn) {
    // 複数 callback 同じキーに設定しない (atarimae)
    // TODO: 同時に押していい感じに！ってキーバインディングしたいかもしれないのであとでやる かも
    this.shortcuts.set(charCode, callback)
  }
  removeShortcut(charCode: number) {
    this.shortcuts.delete(charCode)
  }

  constructor() {
    const ss = localStorage.getItem(KEYS.SEA_CLIENT_PACK)
    if (ss) {
      seaClient.unpack(ss)
      this.loggedIn = true
    }
    localStorage.removeItem(KEYS.SAPP_CACHE_BROKEN)

    this.loadPreferences()

    window.addEventListener('visibilitychange', () => {
      this.setHidden(document.hidden)
    })
    window.document.addEventListener('keypress', ev => {
      if (this.shortcuts.has(ev.charCode)) {
        this.shortcuts.get(ev.charCode)!(ev)
      }
    })

    if (this.preferences.get(PREFERENCE_FORCE_DARK_THEME)) {
      this.enableForceDarkTheme()
    }
    if (this.preferences.get(PREFERENCE_NOTICE_WHEN_MENTIONED)) {
      this.subscribeWebPush()
    }
  }
  @action
  login() {
    const p = seaClient.pack()
    localStorage.setItem(KEYS.SEA_CLIENT_PACK, p)
    this.loggedIn = true
  }
  @action
  logout() {
    seaClient.clear()
    localStorage.removeItem(KEYS.SEA_CLIENT_PACK)
    this.loggedIn = false
  }

  savePreferences() {
    localStorage.setItem(
      KEYS.SAPP_PREFERENCE,
      JSON.stringify(Array.from(this.preferences))
    )
  }
  loadPreferences() {
    const p = localStorage.getItem(KEYS.SAPP_PREFERENCE)
    if (p) {
      const pp = JSON.parse(p)
      this.preferences = new Map(pp)
    }
  }

  async init() {
    try {
      const me = await seaClient
        .get('/v1/account')
        .then((d: any) => new Account(d))
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
    const pms = await Promise.all(ps.map(async (p: any) => new Post(p)))
    // custom process for domain
    const posts = await Promise.all(
      pms.map(post => {
        // model に閉じれない物をここにおきます
        if (!this.me) return post // ほとんどの場合ありえない (呼び出しタイミングを考えると)
        post.body.process([
          NewBoldMyScreenNameMiddleware(this.me),
          pruneEmptyTextMiddleware
        ])
        return post
      })
    )
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
    const r = await seaClient.uploadAlbumFile(name, blob, state)
    return new AlbumFile(r)
  }

  enableForceDarkTheme() {
    // head
    document.firstElementChild!.setAttribute('class', 'dark-theme-enabled')
  }

  disableForceDarkTheme() {
    document.firstElementChild!.removeAttribute('class')
  }

  private async subscribeWebPush(force: boolean = false) {
    const registration = (await Promise.race([
      navigator.serviceWorker.ready,
      (() =>
        new Promise((_, rej) => {
          setTimeout(() => rej(new Error('timeout')), 3 * 1000)
        }))()
    ])) as ServiceWorkerRegistration

    const oldSubscription = await registration.pushManager.getSubscription()
    console.dir(oldSubscription)
    if (oldSubscription) {
      if (!force) return
      oldSubscription.unsubscribe()
    }

    const key = await seaClient.get('/v1/webpush/server_key')
    const pushRegistration = await registration.pushManager.subscribe({
      applicationServerKey: urlB64ToUint8Array(key.applicationServerKey),
      userVisibleOnly: true
    })

    try {
      await seaClient.post(
        '/v1/webpush/subscriptions',
        pushRegistration.toJSON()
      )
    } catch (e) {
      pushRegistration.unsubscribe()
      throw e
    }
  }
  async enableNotification(): Promise<void> {
    const set = () => {
      this.preferences.set(PREFERENCE_NOTICE_WHEN_MENTIONED, true)
      this.savePreferences()
    }

    // Check notification permisson
    if (Notification.permission === 'denied') return Promise.reject()
    if (Notification.permission !== 'granted') {
      const status = await Notification.requestPermission()
      if (status === 'denied' || status === 'default') throw new Error()
    }

    await this.subscribeWebPush(true)
    set()
  }
  disableNotification() {
    this.preferences.set(PREFERENCE_NOTICE_WHEN_MENTIONED, false)
    this.savePreferences()
  }
}

const app = new SApp()
export default app

export const useShortcut = (charCode: number, callback: ShortcutFn) => {
  // custom react hook for shortcut
  useEffect(() => {
    app.addShortcut(charCode, callback)
    return () => {
      app.removeShortcut(charCode)
    }
  }, [])
}
