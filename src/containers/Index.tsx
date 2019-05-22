import * as React from 'react'
const { useEffect } = React
import { useObserver } from 'mobx-react-lite'

import { appStore } from '../stores'
import Index from '../presenters/Index'

export default () => {
  useEffect(() => {
    appStore.init()
  }, [])
  return useObserver(() => <Index me={appStore.me} />)
}
