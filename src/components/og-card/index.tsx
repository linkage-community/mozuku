import * as React from 'react'
import { appStore, PREFERENCE_DISPLAY_OGCARD } from '../../furui/stores'
import { OGCard as Layout } from './og-card'
import { useWebpageMeta } from '../webpage-meta-provider'

export type OGCardProps = Readonly<{
  url: string
  className?: string
}>

const OGCardContent: React.FC<OGCardProps> = ({ className, url }) => {
  const r = useWebpageMeta(url)
  return r ? <Layout className={className} url={url} {...r} /> : null
}

export const OGCard: React.FC<OGCardProps> = (props) => {
  return appStore.getPreference(PREFERENCE_DISPLAY_OGCARD) ? (
    <OGCardContent {...props} />
  ) : null
}
