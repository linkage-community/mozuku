import * as React from 'react'
const { useEffect } = React
import { useObserver } from 'mobx-react-lite'

import { appStore } from '../stores'
import App from '../presenters/App'

export default () => {
  useEffect(() => {
    appStore.init()
  }, [])
  return useObserver(() => <App me={appStore.me} />)
}
