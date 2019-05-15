import $ from 'cafy'
import moment, { Moment } from 'moment'
import Model, { validateDate } from './_Model'

import Application from './Application'
import Account from './Account'
import AlbumFile from './AlbumFile'

interface pictograph {
  decode(s: string): string
}
const pictograph: pictograph = require('pictograph')

export const BODYPART_TYPE_TEXT = 'BODYPART_TYPE_TEXT'
export const BODYPART_TYPE_LINK = 'BODYPART_TYPE_LINK'
export const BODYPART_TYPE_LINK_IMAGE = 'BODYPART_TYPE_LINK_IMAGE'
export const BODYPART_TYPE_BOLD = 'BODYPART_TYPE_BOLD'
export interface PostBodyPart {
  type:
    | typeof BODYPART_TYPE_TEXT
    | typeof BODYPART_TYPE_LINK
    | typeof BODYPART_TYPE_LINK_IMAGE
    | typeof BODYPART_TYPE_BOLD
  payload: string
}
type PostBodyMiddleware = (p: PostBodyPart) => PostBodyPart[]

export const unifyNewLinesMiddleware = (p: PostBodyPart): PostBodyPart[] => {
  if (p.type === BODYPART_TYPE_TEXT) {
    p.payload = p.payload.replace(/\n{2,}/g, '\n\n')
  }
  return [p]
}
export const parseURLMiddleware = (p: PostBodyPart): PostBodyPart[] => {
  if (p.type !== BODYPART_TYPE_TEXT) return [p]
  const r = p.payload.split(/(https?:\/\/[^\s]+)/gi)
  return r.map(
    (r): PostBodyPart => {
      if (r.startsWith('http://') || r.startsWith('https://')) {
        return {
          type: BODYPART_TYPE_LINK,
          payload: r
        }
      }
      return {
        type: BODYPART_TYPE_TEXT,
        payload: r
      }
    }
  )
}
export const convertEmojiMiddleware = (p: PostBodyPart) => {
  if (p.type !== BODYPART_TYPE_TEXT) return [p]
  return [
    {
      ...p,
      payload: pictograph.decode(p.payload)
    }
  ]
}
export const markImageURLMiddleware = (p: PostBodyPart): PostBodyPart[] => {
  if (p.type !== BODYPART_TYPE_LINK) return [p]
  // not image
  if (
    !['.png', '.gif', '.jpg', 'jpeg'].filter(ext => p.payload.endsWith(ext))
      .length
  )
    return [p]
  const url = new URL(p.payload)
  // not whitelisted domain
  if (!PostImage.isImageURL(url)) return [p]
  return [
    {
      type: BODYPART_TYPE_LINK_IMAGE,
      payload: p.payload
    }
  ]
}
export const pruneEmptyTextMiddleware = (p: PostBodyPart): PostBodyPart[] => {
  if (p.type !== BODYPART_TYPE_TEXT) return [p]
  if (p.payload.length === 0) return []
  return [p]
}
const presetMiddlewares: PostBodyMiddleware[] = [
  unifyNewLinesMiddleware,
  parseURLMiddleware,
  convertEmojiMiddleware,
  markImageURLMiddleware,
  pruneEmptyTextMiddleware
]

export const NewBoldMyScreenNameMiddleware = (a: Account) => (
  p: PostBodyPart
): PostBodyPart[] => {
  if (p.type !== BODYPART_TYPE_TEXT) {
    return [p]
  }
  const { screenName } = a
  const target = '@' + screenName
  const r = p.payload.split(new RegExp(`(${target})\\s|$`, 'gi'))
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

export class PostBody {
  parts = [] as PostBodyPart[]
  processed = false

  constructor(body: string) {
    this.reset(body)
  }

  reset(body: string) {
    this.processed = false
    this.parts = []
    this.parts.push({
      type: BODYPART_TYPE_TEXT,
      payload: body
    })
  }

  process(middlewares: PostBodyMiddleware[] = presetMiddlewares) {
    this.parts = middlewares.reduce((parts, middleware) => {
      return parts.reduce(
        (pp, { ...part }) => {
          return [...pp, ...middleware(part)]
        },
        [] as PostBodyPart[]
      )
    }, this.parts)
    this.processed = true
  }
}

export type PostImageVariant = {
  type: 'thumbnail' | 'direct'
  destination: URL
}
export class PostImage {
  static whiteListedDomain = [
    'delta.contents.stream',
    'jet.contents.stream',
    'i.gyazo.com',
    'i.imgur.com'
  ]
  variants = new Map<PostImageVariant['type'], PostImageVariant>()

  readonly backgroundColor = '#ffffff' // placeholder

  static isImageURL(url: URL) {
    return this.whiteListedDomain.includes(url.hostname)
  }

  addVariant(type: PostImageVariant['type'], destination: URL) {
    this.variants.set(type, {
      type,
      destination
    })
  }

  constructor(url: string) {
    const useWeservThumbnail = (href: string) => {
      const tw = new URL('https://images.weserv.nl')
      tw.searchParams.set('url', encodeURI(href))
      const s = 144 * 3
      tw.searchParams.set('w', s.toString())
      tw.searchParams.set('h', s.toString())
      this.addVariant('thumbnail', tw)
    }

    const u = new URL(url)
    this.addVariant('direct', u)
    switch (u.hostname) {
      case 'delta.contents.stream':
        const td = new URL(u.href)
        td.searchParams.set('thumbnail', '')
        this.addVariant('thumbnail', td)
        break
      default:
        useWeservThumbnail(u.href)
        break
    }
  }

  get thumbnail() {
    const t = this.variants.get('thumbnail')
    return t && t.destination.href
  }
  get direct() {
    const r = this.variants.get('direct')
    return r && r.destination.href
  }
}

export default class Post implements Model {
  id: number
  text: string
  createdAt: Moment
  updatedAt: Moment

  body: PostBody
  images: PostImage[] = []
  files: AlbumFile[]
  application: Application
  author: Account

  private validate(post: any) {
    return $.obj({
      id: $.num,
      text: $.str,
      createdAt: validateDate,
      updatedAt: validateDate,
      user: $.any,
      application: $.any,
      files: $.any
    }).throw(post)
  }

  constructor(p: any) {
    const post = this.validate(p)

    const app = new Application(post.application)
    const account = new Account(post.user)

    const body = new PostBody(post.text)
    body.process()

    const images = body.parts.reduce(
      (c, p) => {
        if (p.type !== BODYPART_TYPE_LINK_IMAGE) return c
        return [...c, new PostImage(p.payload)]
      },
      [] as PostImage[]
    )
    const files = post.files.map((file: any) => new AlbumFile(file))

    this.id = post.id
    this.text = post.text
    this.body = body
    this.images = images
    this.files = files
    this.createdAt = moment(post.createdAt)
    this.updatedAt = moment(post.updatedAt)
    this.application = app
    this.author = account
  }

  unpack() {
    return {
      id: this.id,
      text: this.text,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      user: this.author.unpack(),
      application: this.application.unpack(),
      files: this.files.map(file => file.unpack())
    }
  }
}
