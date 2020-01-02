import $ from 'cafy'
import Model, { validateDate } from './_base'
import { AlbumFile } from '../models'

type AccountBody = {
  id: number
  name: string
  screenName: string
  postsCount: number
  createdAt: string
  updatedAt: string
  avatarFile: any
}

export default class Account implements Model<AccountBody> {
  id: number
  name: string
  screenName: string
  postsCount: number
  createdAt: Date
  updatedAt: Date
  avatarFile: null | AlbumFile = null

  private validate(user: any) {
    return $.obj({
      id: $.num,
      name: $.str,
      screenName: $.str,
      postsCount: $.num,
      createdAt: validateDate,
      updatedAt: validateDate,
      avatarFile: $.nullable.any
    }).throw(user)
  }

  constructor(u: AccountBody) {
    const user = this.validate(u)
    this.id = user.id
    this.name = user.name
    this.screenName = user.screenName
    this.postsCount = user.postsCount
    this.createdAt = new Date(user.createdAt)
    this.updatedAt = new Date(user.updatedAt)
    if (user.avatarFile) this.avatarFile = new AlbumFile(user.avatarFile)
  }

  unpack() {
    return {
      id: this.id,
      name: this.name,
      screenName: this.screenName,
      postsCount: this.postsCount,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      avatarFile: this.avatarFile && this.avatarFile.unpack()
    }
  }
}
