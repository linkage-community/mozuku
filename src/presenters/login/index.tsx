import * as React from 'react'

import { Layout, LayoutHeader, LayoutHeaderLogo, LayoutContainer } from '../'

import * as styles from './login.css'

export default ({ authURL }: { authURL: URL }) => (
  <Layout>
    <LayoutHeader>
      <LayoutHeaderLogo disabled={true} />
    </LayoutHeader>
    <LayoutContainer>
      <div className={styles.landing}>
        <h1>Greetings</h1>
        {/* FIXME: このメッセージは仮置き */}
        現時点では Mozuku を利用する前に
        <b>あらかじめSeaにログインする必要があります</b>。<br />
        ->{' '}
        <a href={authURL.origin} target="_blank">
          ログインする
        </a>
        <h2>
          <a href={authURL.href}>Use Mozuku</a>
        </h2>
      </div>
    </LayoutContainer>
  </Layout>
)
