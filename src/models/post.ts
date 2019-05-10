import $ from 'cafy'
import moment, { Moment } from 'moment'
import Model, { validateDate } from './_model'

import Application from './application'
import Account from './account'

interface pictograph {
  decode(s: string): string
}
const pictograph: pictograph = require('pictograph')

export const BODYPART_TYPE_TEXT = 0
export const BODYPART_TYPE_LINK = 1
export const BODYPART_TYPE_LINK_IMAGE = 2
export const BODYPART_TYPE_BOLD = 3
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
export const parseURLmiddleware = (p: PostBodyPart): PostBodyPart[] => {
  if (p.type !== BODYPART_TYPE_TEXT) return [p]
  const r = p.payload.split(/(https?:\/\/[^\s]+)/gi)
  return r.map(
    (r): PostBodyPart => {
      if (r.startsWith('http')) {
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
export const markImageURLmiddleware = (p: PostBodyPart): PostBodyPart[] => {
  if (p.type !== BODYPART_TYPE_LINK) return [p]
  // not image
  if (
    !['.png', '.gif', '.jpg', 'jpeg'].filter(ext => p.payload.endsWith(ext))
      .length
  )
    return [p]
  const url = new URL(p.payload)
  // not whitelisted domain
  if (![
    'delta.contents.stream',
    'jet.contents.stream',
    'i.gyazo.com'
  ].includes(url.hostname)) return [p]
  return [
    {
      type: BODYPART_TYPE_LINK_IMAGE,
      payload: p.payload
    }
  ]
}
const presetMiddlewares: PostBodyMiddleware[] = [
  unifyNewLinesMiddleware,
  parseURLmiddleware,
  convertEmojiMiddleware,
  markImageURLmiddleware
]

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

export default class Post implements Model {
  id: number
  text: string
  createdAt: Moment
  updatedAt: Moment

  body: PostBody
  application: Application
  author: Account

  private validate(post: any) {
    return $.obj({
      id: $.num,
      text: $.str,
      createdAt: validateDate,
      updatedAt: validateDate,
      user: $.any,
      application: $.any
    })
      .strict()
      .throw(post)
  }

  constructor(p: any) {
    const post = this.validate(p)

    const app = new Application(post.application)
    const account = new Account(post.user)

    const body = new PostBody(post.text)
    body.process()

    this.id = post.id
    this.text = post.text
    this.body = body
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
    }
  }
}
