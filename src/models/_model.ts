import $ from 'cafy'
import moment from 'moment'

export default interface Model {
  id: number
  update(input: any): void
}

export const validateDate = $.str.pipe(i => moment(i).isValid())
