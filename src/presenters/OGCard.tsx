import * as React from 'react'
import { useOGP } from '../util/hooks'
import { appStore, PREFERENCE_DISPLAY_OGCARD } from '../stores'

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
    <div className={['ogcard', className].join(' ')}>
      <a href={url} rel="noopener noreferrer" target="_target">
        <div className="ogcard__title">{r.title}</div>
        <div className="ogcard__description">{r.description}</div>
      </a>
    </div>
  )
}
