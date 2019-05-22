import * as React from 'react'

import { Switch, Route } from 'react-router'
import { Link, BrowserRouter } from 'react-router-dom'

import { Account } from '../models'

import Home from './Home'
import NotFound from './NotFound'
import Setting from '../containers/Setting'

import Layout from '../components/Layout'
import Header from '../components/Layout/Header'
import HeaderLogo from '../components/Layout/HeaderLogo'
import Container from '../components/Layout/Container'

export default ({ me }: { me?: Account }) => {
  return (
    <BrowserRouter>
      <Layout>
        <Header>
          <HeaderLogo />
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
        </Header>
        <Container>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/settings" component={Setting} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </Layout>
    </BrowserRouter>
  )
}
