import * as React from 'react'
import { Link } from 'react-router-dom'

import {
  Container,
  HeaderContainer,
  HeaderLogo,
  BodyContainer
} from '../_layout'

const NotFound: React.FC<{ pathname: string }> = ({ pathname }) => (
  <Container>
    <HeaderContainer>
      <HeaderLogo />
    </HeaderContainer>
    <BodyContainer>
      <h2>ここにはなにも、ない</h2>
      {pathname ? <code>{pathname}</code> : null}
      <br />
      <Link to={{ pathname: '/' }}>もどる</Link>
    </BodyContainer>
  </Container>
)
export default NotFound
