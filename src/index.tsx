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

import Config from './config'

const auth = {
  token: null,
}
function PrivateRoute ({ component: Component, ...props }) {
  return (
    <Route {...props} render={props =>
      auth.token
        ? (<Component {...props} />)
        : (<Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />)
    }/>)
}

const Login = ({ location }) => {
  const next = location.state && 'from' in location.state ? location.state.from.path : (new URLSearchParams(location.search)).get('next')

  const authURL = new URL(Config.oauth + '/authorize')
  if (next) authURL.searchParams.set('state', next)
  authURL.searchParams.set('client_id', Config.app.id)
  authURL.searchParams.set('response_type', 'code')

  return (<button onClick={() => window.location.replace(authURL.href)}>Login</button>)
}
const Callback = ({ location }) => {
  const state = (new URLSearchParams(location.search)).get('state') || ''
  const code = (new URLSearchParams(location.search)).get('code')

  const tokenURL = new URL(Config.oauth + '/token')
  const form = new URLSearchParams()
  form.set('client_id', Config.app.id)
  form.set('client_secret', Config.app.secret)
  form.set('state', state)
  form.set('code', code)
  form.set('grant_type', 'authorization_code')

  const [token, error, fetchState] = usePromise(
    () => fetch(tokenURL.href, {
      method: 'POST',
      body: form,
    }).then(r => r.json()),
    []
  )

  if (fetchState === 'pending') return (<>pend...</>)
  if (error) {
    return (<>
      <h1>あほしね</h1>
      <p>{error.message}</p>
    </>)
  }

  if (!token) {
    return (<>
      <h1>あほしね</h1>
      <Link to={`/login?next=${encodeURI(state)}`} />
    </>)
  }
  auth.token = token
  return (<Redirect to={{ pathname: state || '/' }} />)
}

const history = createBrowserHistory()
render((
  <Router history={history}>
    <Switch>
      <PrivateRoute exact path="/" component={Login} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/callback" component={Callback} />
    </Switch>
  </Router>
), document.getElementById('app'))
