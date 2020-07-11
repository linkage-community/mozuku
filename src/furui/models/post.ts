import $ from 'cafy'
import parse, { NodeType } from '@linkage-community/bottlemail'
import Model, { validateDate } from './_base'

import { Application, Account, AlbumFile } from '../models'

export default class Post implements Model {
  id: number
  text: string
  createdAt: Date
  updatedAt: Date

  nodes: NodeType[]
  files: AlbumFile[]
  application: Application
  author: Account
  inReplyToId?: number | null

  private validate(post: any) {
    return $.obj({
      id: $.num,
      text: $.str,
      createdAt: validateDate,
      updatedAt: validateDate,
      user: $.any,
      application: $.any,
      files: $.any,
      inReplyToId: $.optionalNullable.num
    }).throw(post)
  }

  constructor(p: any) {
    const post = this.validate(p)

    const app = new Application(post.application)
    const account = new Account(post.user)

    const nodes = parse(post.text)

    const files = post.files.map((file: any) => new AlbumFile(file))

    this.id = post.id
    this.text = post.text
    this.nodes = nodes
    this.files = files
    this.createdAt = new Date(post.createdAt)
    this.updatedAt = new Date(post.updatedAt)
    this.application = app
    this.author = account
    this.inReplyToId = post.inReplyToId
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
