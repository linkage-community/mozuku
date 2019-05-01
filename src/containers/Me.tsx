import * as React from 'react'
import usePromise from 'react-use-promise'

import seaClient from '../util/seaClient'
import Me from '../components/Me'

import { Account } from '../models'

export default () => {
  const [me,,state] = usePromise<Account>(
    () => seaClient.get('/v1/accounts/my').then((d: any) => new Account(d)),
    []
  )

  if (state !== 'resolved') return (<>Being shown...</>)
  return (<Me name={me.name} screenName={me.screenName} />)
}
