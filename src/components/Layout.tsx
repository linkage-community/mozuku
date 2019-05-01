import * as React from 'react'

import { Switch } from "react-router"
import { Route, Link } from 'react-router-dom'

import My from '../containers/My'
import NotFound from './NotFound'

export default ({ path, onChange }: { path: string, onChange: Function }) => {
  return (
    <div className="mozuku-layout">
      <h1>Mozuku</h1>
      <p>
        <input onChange={(ev) => onChange(ev.target.value)} /> <Link to={{ pathname: path }}>Jump</Link>
      </p>

      <Switch>
        <Route exact path="/my" component={My} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
