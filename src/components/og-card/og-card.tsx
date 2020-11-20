import * as React from 'react'

import * as styles from './og-card.css'
import { ISummary } from 'riassumere/built/interfaces'

export type OGCardProps = ISummary & {
  url: string
  className: string
}

export const OGCard = ({ className, title, description, url }: OGCardProps) => {
  return (
    <blockquote className={[styles.ogcard, className].join(' ')}>
      <a href={url} rel="noopener noreferrer" target="_target">
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </a>
    </blockquote>
  )
}
