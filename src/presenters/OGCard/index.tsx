import * as React from 'react'
import { useOGP } from '../util/hooks'
import { appStore, PREFERENCE_DISPLAY_OGCARD } from '../stores'

import * as styles from './OGCard/ogcard.css'

export default ({
  url,
  className = ''
}: {
  url: string
  className: string
}) => {
  const r = useOGP(url)
  if (!r || !appStore.preferences.get(PREFERENCE_DISPLAY_OGCARD)) return <></>
  return (
    <blockquote className={[styles.ogcard, className].join(' ')}>
      <a href={url} rel="noopener noreferrer" target="_target">
        <div className={styles.title}>{r.title}</div>
        <div className={styles.description}>{r.description}</div>
      </a>
    </blockquote>
  )
}
