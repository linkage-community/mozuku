import $ from 'cafy'
import { isValid } from 'date-fns'

export default interface Model<T = any> {
  id: number
  unpack(): T
}

export const validateDate = $.str.pipe((i) => isValid(new Date(i)))
