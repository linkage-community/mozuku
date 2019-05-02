import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import App from '../stores/app'

import Me from '../presenters/Me'

export default () => {
  return useObserver(() => {
    if (!App.me) return <>Being shown...</>
    return (
      <Me
        name={App.me.name}
        screenName={App.me.screenName}
        createdAt={App.me.createdAt}
      />
    )
  })
}
