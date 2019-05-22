import * as React from 'react'

export default ({ children }: React.Props<void>) => (
  <div className="mozuku-header-wrapper">
    <div className="mozuku-header">{children}</div>
  </div>
)
