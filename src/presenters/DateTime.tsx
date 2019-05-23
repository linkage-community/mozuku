import * as React from 'react'
const { useMemo } = React
import { useRelativeTimeRepresent } from '../util/hooks'
import { formatToTimeZone } from 'date-fns-timezone'

export default ({ dt, className }: { dt: Date; className: string }) => {
  const relativeTimeRepresent = useRelativeTimeRepresent(dt)
  const absoluteTimeRepresent = useMemo(
    () =>
      formatToTimeZone(dt, 'HH:mm:ss · D MMM YYYY', { timeZone: 'Asia/Tokyo' }),
    []
  )
  return (
    <div className={className} title={absoluteTimeRepresent}>
      {relativeTimeRepresent}
    </div>
  )
}
