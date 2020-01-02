import * as React from 'react'

import * as styles from './header.css'

export default ({ children }: React.Props<void>) => (
  <div className={styles.header_wrapper}>
    <div className={styles.header}>{children}</div>
  </div>
)
