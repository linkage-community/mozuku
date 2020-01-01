import $ from 'cafy'
import Model from './_base'

export default class Application implements Model {
  id: number
  name: string
  isAutomated: boolean

  private validate(app: any) {
    return $.obj({
      id: $.num,
      name: $.str,
      isAutomated: $.bool
    }).throw(app)
  }

  constructor(a: any) {
    const app = this.validate(a)
    this.id = app.id
    this.name = app.name
    this.isAutomated = app.isAutomated
  }

  unpack() {
    return {
      id: this.id,
      name: this.name,
      isAutomated: this.isAutomated
    }
  }
}
