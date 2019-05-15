import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import { appStore, PREFERENCE_DISPLAY_META_ENABLED } from '../stores'
import seaClient from '../util/seaClient'
import Setting from '../presenters/Setting'
import timeline from '../stores/timeline';
import { PREFERENCE_NOTICE_WHEN_MENTIONED } from '../stores/app';
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
      appStore.preferences.set(PREFERENCE_DISPLAY_META_ENABLED, e.target.checked)
      appStore.savePreferences()
    },
    []
  )
  const onUpdateEnableNotificationCheckBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        timeline.enableNotification()
      } else {
        timeline.disableNotification()
      }
    }
  , [])

  return useObserver(() => {
    const currentConfig = {
      showMetaEnabled: appStore.preferences.get(PREFERENCE_DISPLAY_META_ENABLED) || false,
      notificationEnabled: appStore.preferences.get(PREFERENCE_NOTICE_WHEN_MENTIONED) || false
    }
    return (
      <Setting
        updateDisabled={updateDisabled}
        updateName={updateName}
        onUpdateShowMetaCheckbox={onUpdateShowMetaCheckbox}
        onUpdateEnableNotificationCheckBox={onUpdateEnableNotificationCheckBox}
        currentName={appStore.me ? appStore.me!.name : undefined}
        logout={appStore.logout.bind(appStore)}
        currentConfig={currentConfig}
      />
    )
  })
}
