import * as React from 'react'
import { RouteComponentProps } from "react-router"
import { Link } from 'react-router-dom'

export default ({ location: { pathname } }: RouteComponentProps) => {
  return (<>
    <h2>Not Found</h2>
    <code>{pathname}</code><br />
    <Link to={{pathname: '/'}}>Return to home</Link>
  </>)
}
