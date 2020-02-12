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
  if (!appStore.getPreference(PREFERENCE_DISPLAY_OGCARD)) return <></>
  const r = useWebpageMeta(url)
  if (!r) return <></>
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
