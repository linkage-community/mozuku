import * as React from 'react'

import { Switch, Route } from "react-router"

import { Account } from '../models'

import Home from '../containers/Home'
import Me from '../containers/Me'
import NotFound from '../components/NotFound'

export default ({ me }: { me?: Account }) => {
  return (
    <div className="mozuku-layout">
      <h1>Mozuku</h1>
      <p>
        { me ? (<span>Login as @{me.screenName}</span>) : (<span>[誰?]</span>) }
      </p>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/me" component={Me} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
