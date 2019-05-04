import * as React from 'react'
const { useEffect } = React
import { useObserver } from 'mobx-react-lite'

import App from '../stores/app'
import Layout from '../presenters/Layout'
import Helmet from 'react-helmet';

export default () => {
  useEffect(() => {
    App.init()
    window.onblur = () => {
      App.onBlur()
    }
    window.onfocus = () => {
      App.onFocus()
    }
  }, [])
  return useObserver(() => {
    if (!App.initialized) return <>Loading...</>
    return (
      <>
        <Helmet title="Mozuku" />
        <Layout
          me={App.me}
          onClickLogout={e => {
            e.preventDefault()
            App.logout()
          }}
        />
      </>
    )
  })
}
