import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import appStore from '../stores/app'

import Me from '../presenters/Me'

export default () => {
  return useObserver(() => {
    if (!appStore.me) return <>Being shown...</>
    return (
      <Me
        name={appStore.me.name}
        screenName={appStore.me.screenName}
        createdAt={appStore.me.createdAt}
      />
    )
  })
}
