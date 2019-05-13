import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import { appStore, PREFERENCE_SHOW_META } from '../stores'
import seaClient from '../util/seaClient'
import Setting from '../presenters/Setting'
const { useState, useCallback } = React

export default () => {
  const [updateDisabled, lock] = useState(false)
  const updateName = useCallback(async (name: string) => {
    const currentName = appStore.me ? appStore.me!.name : undefined
    if (currentName === name) return
    try {
      lock(true)
      appStore.setAccounts([await seaClient.patch('/v1/account', { name })])
      // FIXME: もっといい手段で伝える
      alert('更新成功！')
    } catch (e) {
      // TODO: Add error reporting
      console.error(e)
    } finally {
      lock(false)
    }
  }, [])
  const onUpdateShowMetaCheckbox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // FIXME: ここきたない
      appStore.preferences.set(PREFERENCE_SHOW_META, e.target.checked)
      appStore.savePreferences()
    },
    []
  )

  return useObserver(() => {
    const currentConfig = {
      showMeta: appStore.preferences.get(PREFERENCE_SHOW_META) || false
    }
    return (
      <Setting
        updateDisabled={updateDisabled}
        updateName={updateName}
        onUpdateShowMetaCheckbox={onUpdateShowMetaCheckbox}
        currentName={appStore.me ? appStore.me!.name : undefined}
        logout={appStore.logout.bind(appStore)}
        currentConfig={currentConfig}
      />
    )
  })
}
