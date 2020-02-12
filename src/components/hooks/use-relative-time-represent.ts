import { useState, useEffect } from 'react'
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
const diffFromNow = (dt: Date): TimeDiff | undefined => {
  const now = Date.now()

  const months = differenceInMonths(now, dt)
  if (months > 0) return { type: Month, duration: months }

  const weeks = differenceInWeeks(now, dt)
  if (weeks > 0) return { type: Week, duration: weeks }

  const days = differenceInDays(now, dt)
  if (days > 0) return { type: Day, duration: days }

  const hours = differenceInHours(now, dt)
  if (hours > 0) return { type: Hour, duration: hours }

  const minutes = differenceInMinutes(now, dt)
  if (minutes > 0) return { type: Minute, duration: minutes }

  const seconds = differenceInSeconds(now, dt)
  if (seconds > 0) return { type: Second, duration: seconds }
}

export const useRelativeTimeRepresent = (dt: Date) => {
  const { useForceUpdatePerEverySecond } = useBrowserHooks()
  useForceUpdatePerEverySecond()

  const diff = diffFromNow(dt)
  if (!diff) return
  if (diff.type === Month) return format(dt, 'd MMM yyyy')
  return `${diff.duration}${diff.type}`
}
