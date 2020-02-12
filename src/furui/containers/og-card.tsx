import * as React from 'react'
import { appStore, PREFERENCE_DISPLAY_OGCARD } from '../stores'
import { OGCard } from '../presenters'
import { useWebpageMeta } from '../../components/webpage-meta-provider'

export default ({
  url,
  className = ''
}: {
  url: string
  className: string
}) => {
  const r = useWebpageMeta(url)
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
