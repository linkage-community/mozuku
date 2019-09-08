import * as React from 'react'

import { Switch, Route } from 'react-router'
import { Link, BrowserRouter } from 'react-router-dom'

import { Account } from '../../models'

import { LocalTimeline, SettingPage } from '../../containers'
import {
  NotFound,
  Layout,
  LayoutContainer,
  LayoutHeaderLogo,
  LayoutHeader
} from '..'

import * as styles from './index.css'

export default ({ me }: { me?: Account }) => {
  return (
    <BrowserRouter>
      <Layout>
        <LayoutHeader>
          <LayoutHeaderLogo />
          <div className={styles.account}>
            {me ? (
              <>@{me.screenName}</>
            ) : (
              <span>
                <i>[誰?]</i>
              </span>
            )}
          </div>
          <div className={styles.setting}>
            <Link to={{ pathname: '/settings' }}>
              <i className="uil uil-cog" />
            </Link>
          </div>
        </LayoutHeader>
        <LayoutContainer>
          <Switch>
            <Route exact path="/" component={LocalTimeline} />
            <Route exact path="/settings" component={SettingPage} />
            <Route component={NotFound} />
          </Switch>
        </LayoutContainer>
      </Layout>
    </BrowserRouter>
  )
}
