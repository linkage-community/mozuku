import $ from 'cafy'
import moment from 'moment'

export default interface Model<T = any> {
  id: number
  unpack(): T
}

export const validateDate = $.str.pipe(i => moment(i).isValid())
