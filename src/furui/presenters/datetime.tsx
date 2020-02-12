import * as React from 'react'
const { useMemo } = React
import { format } from 'date-fns-tz'
import { useBrowserHooks } from '../../components/browser-provider'

export default ({ dt, className }: { dt: Date; className?: string }) => {
  const { useRelativeTimeRepresent } = useBrowserHooks()
  const relativeTimeRepresent = useRelativeTimeRepresent(dt)
  const absoluteTimeRepresent = useMemo(
    () => format(dt, 'HH:mm:ss · d MMM yyyy', { timeZone: 'Asia/Tokyo' }),
    []
  )
  return (
    <div className={className} title={absoluteTimeRepresent}>
      {relativeTimeRepresent}
    </div>
  )
}
