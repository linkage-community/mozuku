import * as React from 'react'

import Layout from '../components/Layout'
import Header from '../components/Layout/Header'
import HeaderLogo from '../components/Layout/HeaderLogo'
import Container from '../components/Layout/Container'

export default ({ authURL }: { authURL: URL }) => (
  <Layout>
    <Header>
      <HeaderLogo disabled={true} />
    </Header>
    <Container>
      <div className="mozuku-landing">
        <h1>Greetings</h1>
        {/* FIXME: このメッセージは仮置き */}
        現時点では Mozuku を利用する前に
        <b>あらかじめSeaにログインする必要があります</b>。<br />
        ->{' '}
        <a href={authURL.origin + '/login'} target="_blank">
          ログインする
        </a>
        <h2>
          <a href={authURL.href}>Use Mozuku</a>
        </h2>
      </div>
    </Container>
  </Layout>
)
