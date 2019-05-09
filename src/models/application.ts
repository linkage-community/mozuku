import $ from 'cafy'
import Model from './_model'

export default class Application implements Model {
  id: number
  name: string

  private validate(app: any) {
    return $.obj({
      id: $.num,
      name: $.str
    })
      .strict()
      .throw(app)
  }

  constructor(a: any) {
    const app = this.validate(a)
    this.id = app.id
    this.name = app.name
  }

  unpack() {
    return {
      id: this.id,
      name: this.name
    }
  }
}
