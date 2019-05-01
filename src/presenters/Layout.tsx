import * as React from 'react'

import { Switch, Route } from "react-router"
import { Link } from 'react-router-dom'

import { Account } from '../models'

import Home from '../containers/Home'
import Me from '../containers/Me'
import NotFound from '../components/NotFound'

export default ({ me, onClickLogout }: { me?: Account, onClickLogout: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
  return (
    <div className="mozuku-layout">
      <h1>Mozuku</h1>
      <Link to={{pathname: '/'}}>Home</Link> <Link to={{pathname: '/me'}}>About me</Link>
      <p>
        { me ? (<span>@{me.screenName}</span>) : (<span><i>[誰?]</i></span>) }
        <button style={{ marginLeft: 4 }} onClick={onClickLogout}>👋</button>
      </p>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/me" component={Me} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
