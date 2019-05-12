import * as React from 'react'

import { Switch, Route } from 'react-router'
import { Link } from 'react-router-dom'

import { Account } from '../models'

import Home from './Home'
import NotFound from './NotFound'
import Setting from '../containers/Setting'

import logo from '../static/logo.png'

export default ({ me }: { me?: Account }) => {
  return (
    <div className="mozuku-layout">
      <div className="mozuku-header-wrapper">
        <div className="mozuku-header">
          <h1 className="mozuku-header__logo">
            <Link to={{ pathname: '/' }}>
              <img src={logo} width="64" height="64" alt="Mozuku" />
            </Link>
          </h1>
          <div>
            {me ? (
              <>@{me.screenName}</>
            ) : (
              <span>
                <i>[誰?]</i>
              </span>
            )}
          </div>
          <div className="mozuku-header__setting">
            <Link to={{ pathname: '/settings' }}>⚙</Link>
          </div>
        </div>
      </div>

      <div className="mozuku-container">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/settings" component={Setting} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  )
}
