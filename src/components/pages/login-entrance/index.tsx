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
        <h2 className={styles.authLinkContainer}>
          <span className={styles.desktopOnly}>→→→→→→→→ </span>
          <div className={styles.spOnly}>↓↓↓↓↓↓↓↓</div>
          <a href={authURL.href}>認証する</a>
          <span className={styles.desktopOnly}> ←←←←←←←←</span>
          <div className={styles.spOnly}>↑↑↑↑↑↑↑↑</div>
        </h2>
      </div>
    </BodyContainer>
  </Container>
)
