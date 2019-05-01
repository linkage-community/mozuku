/*
 * mozuku - One Mozuku
 * Copyright (C) 2019 otofune <otofune@otofune.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import * as React from 'react'
import { render } from 'react-dom'
import { Router, Switch, Redirect } from "react-router"
import { Route, Link } from 'react-router-dom'
import usePromise from 'react-use-promise'
import { createBrowserHistory } from "history"

import seaClient from './util/seaClient'
import Layout from './containers/Layout'

function PrivateRoute ({ component: Component, ...props }) {
  console.dir(seaClient.authd)
  console.dir(seaClient)
  return (
    <Route {...props} render={props =>
      seaClient.authd
        ? (<Component {...props} />)
        : (<Redirect to={{
            pathname: '/login',
            state: { from: props.location.pathname }
          }} />)
    }/>)
}

const Login = ({ location }) => {
  const next = location.state && location.state.from || (new URLSearchParams(location.search)).get('next')
  const authURL = seaClient.getAuthorizeURL(next)

  return (<>
    <h1>Sign in to Mozuku</h1>
    <button onClick={() => window.location.replace(authURL)}>Login</button>
  </>)
}
const Callback = ({ location }) => {
  const code = (new URLSearchParams(location.search)).get('code')
  const state = (new URLSearchParams(location.search)).get('state')

  const [,error,fetchState] = usePromise(
    () => seaClient.obtainToken(code, state),
    []
  )

  if (fetchState === 'pending') return (<>You are being redirected...</>)
  if (error) {
    return (<>
      <h1>Bad Request</h1>
      <p>{error.message}</p>
      <Link to={`/login?next=${encodeURI(state)}`}>Retry</Link>
    </>)
  }

  return (<Redirect to={{ pathname: state || '/' }} />)
}

const history = createBrowserHistory()
render((
  <Router history={history}>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/callback" component={Callback} />
      <PrivateRoute component={Layout} />
    </Switch>
  </Router>
), document.getElementById('app'))
