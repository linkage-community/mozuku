import * as React from 'react'
const { useEffect } = React
import { useObserver } from 'mobx-react-lite'

import App from '../stores/app'
import Layout from '../presenters/Layout'

export default () => {
  useEffect(() => {
    App.loadMe()
  }, [])
  return useObserver(() => (<Layout me={App.me} />))
}
