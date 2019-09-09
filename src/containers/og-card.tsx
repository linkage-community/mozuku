import * as React from 'react'
import { useOGP } from '../util/hooks'
import { appStore, PREFERENCE_DISPLAY_OGCARD } from '../stores'
import { OGCard } from '../presenters'

export default ({
  url,
  className = ''
}: {
  url: string
  className: string
}) => {
  const r = useOGP(url)
  if (!r || !appStore.getPreference(PREFERENCE_DISPLAY_OGCARD)) return <></>
  return OGCard(
    Object.assign(
      {
        url,
        className
      },
      r
    )
  )
}
