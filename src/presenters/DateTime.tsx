import * as React from 'react'
const { useMemo } = React
import { useRelativeTimeRepresent } from '../util/hooks'
import moment, { Moment } from 'moment-timezone'

export default ({ dt, className }: { dt: Moment; className: string }) => {
  const relativeTimeRepresent = useRelativeTimeRepresent(dt)
  const absoluteTimeRepresent = useMemo(
    () =>
      moment(dt)
        .tz('Asia/Tokyo') // current tz にしたくない
        .format('HH:mm:ss · D MMM YYYY'),
    []
  )
  return (
    <div className={className} title={absoluteTimeRepresent}>
      {relativeTimeRepresent}
    </div>
  )
}
