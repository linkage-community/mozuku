import * as React from 'react'

import * as styles from './og-card.css'
import { ISummary } from 'riassumere/built/interfaces'

export type OGCardProps = Readonly<
  ISummary & {
    className: string
    url: string
  }
>

export const OGCard = ({ className, description, title, url }: OGCardProps) => {
  return (
    <blockquote className={[styles.ogcard, className].join(' ')}>
      <a href={url} rel="noopener noreferrer" target="_target">
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </a>
    </blockquote>
  )
}
