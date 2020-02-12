import * as React from 'react'
import { Link } from 'react-router-dom'
import { Account } from '../../../furui/models'

import {
  Container,
  BodyContainer,
  HeaderContainer,
  HeaderLogo
} from '../_layout'

import * as styles from './index.css'
import { BrowserProvider } from '../../browser-provider'
import { WebpageMetaProvider } from '../../webpage-meta-provider'

const AppProvider: React.FC = ({ children }) => (
  <BrowserProvider>
    <WebpageMetaProvider>{children}</WebpageMetaProvider>
  </BrowserProvider>
)

const AuthenticatedContainer: React.FC<{ me?: Account }> = ({
  me,
  children
}) => {
  return (
    <Container>
      <AppProvider>
        <HeaderContainer>
          <HeaderLogo />
          <div className={styles.account}>
            <span>{me ? <>@{me.screenName}</> : <i>[誰?]</i>}</span>
          </div>
          <div className={styles.setting}>
            <Link to={{ pathname: '/settings' }}>
              <i className="uil uil-cog" />
            </Link>
          </div>
        </HeaderContainer>
        <BodyContainer>{children}</BodyContainer>
      </AppProvider>
    </Container>
  )
}
export default AuthenticatedContainer
