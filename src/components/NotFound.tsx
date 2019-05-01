import * as React from 'react'
import { RouteComponentProps } from "react-router"

export default ({ location: { pathname } }: RouteComponentProps) => {
  return (<>
    <h2>Not Found</h2>
    <code>{pathname}</code>
  </>)
}
