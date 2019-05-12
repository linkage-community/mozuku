import $ from 'cafy'
import moment, { Moment } from 'moment'
import Model, { validateDate } from './_model'

export default class Account implements Model {
  id: number
  name: string
  screenName: string
  postsCount: number
  createdAt: Moment
  updatedAt: Moment

  private validate(user: any) {
    return $.obj({
      id: $.num,
      name: $.str,
      screenName: $.str,
      postsCount: $.num,
      createdAt: validateDate,
      updatedAt: validateDate
    })
      .throw(user)
  }

  constructor(u: any) {
    const user = this.validate(u)
    this.id = user.id
    this.name = user.name
    this.screenName = user.screenName
    this.postsCount = user.postsCount
    this.createdAt = moment(user.createdAt)
    this.updatedAt = moment(user.updatedAt)
  }

  unpack() {
    return {
      id: this.id,
      name: this.name,
      screenName: this.screenName,
      postsCount: this.postsCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
