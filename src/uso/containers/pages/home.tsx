import * as React from 'react'
const { useEffect } = React
import { useObserver } from 'mobx-react-lite'

import { appStore } from '../../stores'
import { Home } from '../../presenters'

export default () => {
  useEffect(() => {
    appStore.init()
  }, [])
  return useObserver(() => <Home me={appStore.me} />)
}
