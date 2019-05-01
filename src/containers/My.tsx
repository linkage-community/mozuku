import * as React from 'react'
import usePromise from 'react-use-promise'

import seaClient from '../util/seaClient'

import My from '../components/My'

export default () => {
  const [my,,state] = usePromise(
    () => seaClient.get('/accounts/my'),
    []
  )

  if (state !== 'resolved') return (<>Being shown...</>)
  return (<My name={my.name} screenName={my.screenName} />)
}
