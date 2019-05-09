import $ from 'cafy'
import moment from 'moment'

export default interface Model {
  id: number
  unpack(): any
}

export const validateDate = $.str.pipe(i => moment(i).isValid())
