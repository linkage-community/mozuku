import * as React from 'react'
import { Location } from 'history'

export default ({ location: { pathname } }: { location: Location }) => {
  return (<>
    <h2>Not Found</h2>
    <code>{pathname}</code>
  </>)
}
