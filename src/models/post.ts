import $ from 'cafy'
import moment, { Moment } from 'moment'
import Model, { validateDate } from './_model'

import Application from './application'
import Account from './Account'

export const BODYPART_TYPE_TEXT = 0
export const BODYPART_TYPE_LINK = 1
export interface PostBodyPart {
  type: typeof BODYPART_TYPE_TEXT | typeof BODYPART_TYPE_LINK,
  payload: string,
}
type PostBodyMiddleware = (p: PostBodyPart) => PostBodyPart[]

export const unifyNewLinesMiddleware = (p: PostBodyPart) => {
  if (p.type === BODYPART_TYPE_TEXT) {
    p.payload = p.payload.replace(/\n{2,}/g, '\n\n')
  }
  return [p]  
}
export const parseURLmiddleware = (p: PostBodyPart) => {
  if (p.type !== BODYPART_TYPE_TEXT) return [p]
  const r = p.payload.split(/(https?:\/\/[^\s]+)/ig)
  return r.map((r): PostBodyPart => {
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
  })
}
const presetMiddlewares: PostBodyMiddleware[] = [unifyNewLinesMiddleware, parseURLmiddleware]

export class PostBody {
  parts = [] as PostBodyPart[]
  processed = false

  constructor (body: string) {
    this.reset(body)
  }

  reset (body: string) {
    this.processed = false
    this.parts = []
    this.parts.push({
      type: BODYPART_TYPE_TEXT,
      payload: body,
    })
  }

  process (middlewares: PostBodyMiddleware[] = presetMiddlewares) {
    this.parts = middlewares.reduce((parts, middleware) => {
      return parts.reduce((pp, { ...part }) => {
        return [...pp, ...middleware(part)]
      }, [] as PostBodyPart[])
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

  update(p: any) {
    const post = this.validate(p)
    if (this.id && this.id !== post.id) throw new Error()

    const app = new Application(post.application)
    const account = new Account(post.user)

    this.id = post.id
    this.text = post.text
    this.createdAt = moment(post.createdAt)
    this.updatedAt = moment(post.updatedAt)
    this.application = app
    this.author = account
  }
}
