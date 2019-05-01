import $ from 'cafy'
import moment, { Moment } from 'moment'
import Model, { validateDate } from './_model'

import Application from './application'
import Account from './Account'

export default class Post implements Model {
  id: number
  text: string
  createdAt: Moment
  updatedAt: Moment

  application: Application
  author: Account

  private validate (post: any) {
    return $.obj({
      id: $.num,
      text: $.str,
      createdAt: validateDate,
      updatedAt: validateDate,
      user: $.any,
      application: $.any
    }).strict().throw(post)
  }

  constructor (p: any) {
    const post = this.validate(p)

    const app = new Application(post.application)
    const account = new Account(post.user)

    this.id = post.id
    this.text = post.text
    this.createdAt = moment(post.createdAt)
    this.updatedAt = moment(post.updatedAt)
    this.application = app
    this.author = account
  }

  update (p: any) {
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
