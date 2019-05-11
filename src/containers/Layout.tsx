import * as React from 'react'
const { useEffect } = React
import { useObserver } from 'mobx-react-lite'

import { appStore } from '../stores'
import Layout from '../presenters/Layout'

export default () => {
  useEffect(() => {
    appStore.init()
  }, [])
  return useObserver(() => (<Layout me={appStore.me} />))
}
