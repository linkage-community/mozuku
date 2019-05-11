import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import { appStore, configStore } from '../stores'
import seaClient from '../util/seaClient'
import Setting from '../presenters/Setting';
const { useState, useCallback } = React

export default () => {
  const [updateDisabled, lock] = useState(false)
  const updateName = useCallback(async (name: string) => {
    try {
      lock(true)
      appStore.setAccounts([
        await seaClient.patch('/v1/account', { name })
      ])
    } catch (e) {
      // TODO: Add error reporting
      console.error(e)
    } finally {
      lock(false)
    }
  }, [])

  return useObserver(() => {
    return (
      <Setting
        updateDisabled={updateDisabled}
        updateName={updateName}
        currentName={appStore.me ? appStore.me!.name : undefined} />
    )
  })
}
