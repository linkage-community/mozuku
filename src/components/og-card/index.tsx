import * as React from 'react'
import { appStore, PREFERENCE_DISPLAY_OGCARD } from '../../furui/stores'
import { OGCard as Layout } from './og-card'
import { useWebpageMeta } from '../webpage-meta-provider'

export type OGCardProps = Readonly<{
  url: string
  className?: string
}>

export const OGCard: React.FC<OGCardProps> = ({ url, className }) => {
  if (!appStore.getPreference(PREFERENCE_DISPLAY_OGCARD)) return null
  const r = useWebpageMeta(url)
  return r ? <Layout className={className} url={url} {...r} /> : null
}
