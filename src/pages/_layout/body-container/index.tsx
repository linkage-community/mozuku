import * as React from 'react'

import * as styles from './container.css'

export default ({ children }: React.Props<void>) => (
  <div className={styles.container}>{children}</div>
)
