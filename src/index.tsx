/*
 * mozuku - One of seaweed, client of rinsuki/sea
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
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router'
import { BrowserRouter, Link } from 'react-router-dom'
import usePromise from 'react-use-promise'

import seaClient from './util/seaClient'

import { useObserver } from 'mobx-react-lite'
import { appStore } from './stores'

import Layout from './containers/Layout'
import Landing from './presenters/Landing'

const RedirectToLogin = ({ location }: RouteComponentProps) => (
  <Redirect
    to={{
      pathname: '/login',
      state: { from: location.pathname }
    }}
  />
)
const Login = ({ location }: RouteComponentProps) => {
  const next =
    (location.state && location.state.from) ||
    new URLSearchParams(location.search).get('next') ||
    ''
  const authURL = seaClient.getAuthorizeURL(next)
  return <Landing authURL={new URL(authURL)} />
}
const Callback = ({ location }: RouteComponentProps) => {
  const code = new URLSearchParams(location.search).get('code')
  const state = new URLSearchParams(location.search).get('state') || ''

  const [, error, fetchState] = usePromise(async () => {
    if (!code) throw new Error('Missing code.')
    await seaClient.obtainToken(code, state)
    appStore.login()
  }, [])

  if (fetchState === 'pending') return <>You are being redirected...</>
  if (error) {
    return (
      <>
        <h1>Bad Request</h1>
        <p>{error.message}</p>
        <Link to={state ? `/login?next=${encodeURI(state)}` : '/login'}>
          Retry
        </Link>
      </>
    )
  }

  return <Redirect to={{ pathname: state || '/' }} />
}

const App = () => {
  return useObserver(() => (
    <BrowserRouter>
      <Switch>
        <Route exact path="/callback" component={Callback} />
        {!appStore.loggedIn && <Route exact path="/login" component={Login} />}
        {!appStore.loggedIn && <Route component={RedirectToLogin} />}
        <Route component={Layout} />
      </Switch>
    </BrowserRouter>
  ))
}

render(<App />, document.getElementById('app'))
