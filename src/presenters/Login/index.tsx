import * as React from 'react'

import Layout from '../Layout'
import Header from '../Layout/Header'
import HeaderLogo from '../Layout/HeaderLogo'
import Container from '../Layout/Container'

import * as styles from '../Login/login.css'

export default ({ authURL }: { authURL: URL }) => (
  <Layout>
    <Header>
      <HeaderLogo disabled={true} />
    </Header>
    <Container>
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
    </Container>
  </Layout>
)
