import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import { appStore, PREFERENCE_SHOW_META } from '../stores'
import seaClient from '../util/seaClient'
import Setting from '../presenters/Setting'
const { useState, useCallback } = React

export default () => {
  const [updateDisabled, lock] = useState(false)
  const updateName = useCallback(async (name: string) => {
    try {
      lock(true)
      appStore.setAccounts([await seaClient.patch('/v1/account', { name })])
      alert('更新成功！')
    } catch (e) {
      // TODO: Add error reporting
      console.error(e)
    } finally {
      lock(false)
    }
  }, [])
  // TODO: FIx interface (argument) - 意味不明 (なぜ showMeta だけ指定で切るの？とか)
  const updateConfig = useCallback((showMeta: boolean) => {
    // FIXME: ここきたない
    appStore.preferences.set(PREFERENCE_SHOW_META, showMeta)
    appStore.savePreferences()
  }, [])

  return useObserver(() => {
    const currentConfig = {
      showMeta: appStore.preferences.get(PREFERENCE_SHOW_META) || false
    }
    return (
      <Setting
        updateDisabled={updateDisabled}
        updateName={updateName}
        updateConfig={updateConfig}
        currentName={appStore.me ? appStore.me!.name : undefined}
        logout={appStore.logout.bind(appStore)}
        currentConfig={currentConfig}
      />
    )
  })
}
