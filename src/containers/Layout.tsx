import * as React from 'react'
const { useEffect } = React
import { useObserver } from 'mobx-react-lite'

import App from '../stores/app'
import Layout from '../presenters/Layout'

export default () => {
  useEffect(() => {
    App.init()
  }, [])
  return useObserver(() => {
    if (!App.initialized) return <>Loading...</>
    return (
      <Layout
        me={App.me}
        onClickLogout={e => {
          e.preventDefault()
          App.logout()
        }} />
    )
  })
}
