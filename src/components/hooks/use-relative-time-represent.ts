import {
  differenceInMonths,
  differenceInWeeks,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format
} from 'date-fns'
import { useBrowserHooks } from '../browser-provider'

const Month = 'mo'
const Week = 'w'
const Day = 'd'
const Hour = 'h'
const Minute = 'm'
const Second = 's'
type TimeDiff = {
  type:
    | typeof Month
    | typeof Week
    | typeof Day
    | typeof Hour
    | typeof Minute
    | typeof Second
  duration: number
}
const diffFrom = (dt: Date, nowInMs: number): TimeDiff | undefined => {
  const months = differenceInMonths(nowInMs, dt)
  if (months > 0) return { type: Month, duration: months }

  const weeks = differenceInWeeks(nowInMs, dt)
  if (weeks > 0) return { type: Week, duration: weeks }

  const days = differenceInDays(nowInMs, dt)
  if (days > 0) return { type: Day, duration: days }

  const hours = differenceInHours(nowInMs, dt)
  if (hours > 0) return { type: Hour, duration: hours }

  const minutes = differenceInMinutes(nowInMs, dt)
  if (minutes > 0) return { type: Minute, duration: minutes }

  const seconds = differenceInSeconds(nowInMs, dt)
  if (seconds > 0) return { type: Second, duration: seconds }
}

export const useRelativeTimeRepresent = (dt: Date) => {
  const { useCurrentTimeInMilliseconds } = useBrowserHooks()
  const nowInMs = useCurrentTimeInMilliseconds()
  const diff = diffFrom(dt, nowInMs)

  if (!diff) return '0'
  if (diff.type === Month) return format(dt, 'd MMM yyyy')
  return `${diff.duration}${diff.type}`
}
