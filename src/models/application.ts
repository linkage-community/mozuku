import $ from 'cafy'
import Model from './_model'

export default class Application implements Model {
  id: number
  name: string

  private validate (app: any) {
    return $.obj({
      id: $.num,
      name: $.str,
    }).strict().throw(app)
  }

  constructor (a: any) {
    const app = this.validate(a)
    this.id = app.id
    this.name = app.name
  }

  update (a: any) {
    const app = this.validate(a)
    if (this.id && this.id !== a.id) throw new Error()
    this.id = app.id
    this.name = app.name
  }
}
