import * as React from 'react'

import { Switch } from "react-router"
import { Route, Link } from 'react-router-dom'

import Me from '../containers/Me'
import Home from '../containers/Home'
import NotFound from './NotFound'

export default ({ path, onChange }: { path: string, onChange: Function }) => {
  return (
    <div className="mozuku-layout">
      <h1>Mozuku</h1>
      <p>
        <input onChange={(ev) => onChange(ev.target.value)} /> <Link to={{ pathname: path }}>Jump</Link>
      </p>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/me" component={Me} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
