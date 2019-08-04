import * as React from 'react'

import * as styles from '../OGCard/ogcard.css'
import { ISummary } from 'riassumere/built/interfaces'

export default ({
  className,
  title,
  description,
  url
}: ISummary & {
  url: string
  className: string
}) => {
  return (
    <blockquote className={[styles.ogcard, className].join(' ')}>
      <a href={url} rel="noopener noreferrer" target="_target">
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </a>
    </blockquote>
  )
}
