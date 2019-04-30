import * as React from 'react'
import usePromise from 'react-use-promise'

import Config from '../config'
import Auth from '../auth'

export default () => {
  const { authorization } = Auth
  const [my, error, state] = usePromise(
    () => fetch(Config.api + '/accounts/my', {
      headers: {
        authorization
      }
    }).then(r => r.json()),
    []
  )

  if (state !== 'resolved') return (<>Being shown...</>)

  return (
    <>
      {my.name} @{my.screenName}
    </>
  )
}
