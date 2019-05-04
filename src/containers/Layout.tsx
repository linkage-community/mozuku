import * as React from 'react'
const { useEffect } = React
import { useObserver } from 'mobx-react-lite'

import appStore from '../stores/app'
import Layout from '../presenters/Layout'

export default () => {
  useEffect(() => {
    appStore.init()
  }, [])
  return useObserver(() => {
    if (!appStore.initialized) return <>Loading...</>
    return (
      <>
        <Layout
          me={appStore.me}
          onClickLogout={e => {
            e.preventDefault()
            appStore.logout()
          }}
        />
      </>
    )
  })
}
