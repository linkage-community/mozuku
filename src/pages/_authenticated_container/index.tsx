import * as React from 'react'
import { Link } from 'react-router-dom'
import { Account } from '../../uso/models'

import {
  Container,
  BodyContainer,
  HeaderContainer,
  HeaderLogo
} from '../_layout'

import * as styles from './index.css'

const AuthenticatedContainer: React.FC<{ me?: Account }> = ({
  me,
  children
}) => {
  return (
    <Container>
      <HeaderContainer>
        <HeaderLogo />
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
      </HeaderContainer>
      <BodyContainer>{children}</BodyContainer>
    </Container>
  )
}
export default AuthenticatedContainer
