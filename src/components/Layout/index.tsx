import * as React from 'react'

import * as styles from './layout.css'

export default ({ children }: React.Props<void>) => (
  <div className={styles.layout}>{children}</div>
)
