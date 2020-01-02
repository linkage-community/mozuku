import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import { appStore } from '../../../furui/stores'
import AuthenticatedContainer from '../_authenticated_container'
import { LocalTimeline } from '../../../furui/containers'

const { useEffect } = React

const Home: React.FC = () => {
  useEffect(() => {
    appStore.init()
  }, [])
  return useObserver(() => {
    return (
      <AuthenticatedContainer me={appStore.me}>
        <LocalTimeline />
      </AuthenticatedContainer>
    )
  })
}
export default Home
