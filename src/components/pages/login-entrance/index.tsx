import * as React from 'react'

import {
  Container,
  HeaderContainer,
  HeaderLogo,
  BodyContainer
} from '../_layout'

import * as styles from './login.css'

export default ({ authURL }: { authURL: URL }) => (
  <Container>
    <HeaderContainer>
      <HeaderLogo disabled={true} />
    </HeaderContainer>
    <BodyContainer>
      <div className={styles.landing}>
        <h1>Greetings</h1>
        今すぐ認証!!!
        <h2>
          →→→→→→→→ <a href={authURL.href}>認証する</a> ←←←←←←←←
        </h2>
      </div>
    </BodyContainer>
  </Container>
)
