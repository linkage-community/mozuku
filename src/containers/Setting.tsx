import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import { appStore, PREFERENCE_DISPLAY_META_ENABLED } from '../stores'
import seaClient from '../util/seaClient'
import Setting from '../presenters/Setting'
import timeline from '../stores/timeline'
import {
  PREFERENCE_NOTICE_WHEN_MENTIONED,
  PREFERENCE_DISPLAY_OGCARD,
  PREFERENCE_FORCE_DARK_THEME
} from '../stores/app'
const { useState, useCallback } = React

const read = (f: File): Promise<Blob> =>
  new Promise((res, rej) => {
    const reader = new FileReader()
    reader.addEventListener(
      'loadend',
      () => {
        if (!reader.result || typeof reader.result === 'string')
          return rej(new Error('Why not array buffer.'))
        res(new Blob([reader.result], { type: f.type }))
      },
      false
    )
    reader.addEventListener('error', () => {
      rej(reader.error)
    })
    reader.readAsArrayBuffer(f)
  })

export default () => {
  const [disabled, lock] = useState(false)
  const update = useCallback(
    async ({ name, avatar }: { name?: string; avatar?: File }) => {
      try {
        lock(true)

        const data: {
          name?: string
          avatarFileId?: number
        } = {}

        if (name) {
          const currentName = appStore.me ? appStore.me!.name : undefined
          if (currentName !== name) {
            data.name = name
          }
        }
        if (avatar) {
          const b = await read(avatar)
          const avatarFile = await appStore.uploadAlbumFile(avatar.name, b)
          data.avatarFileId = avatarFile.id
        }

        // TODO: Move to client
        appStore.setAccounts([await seaClient.patch('/v1/account', data)])
        // FIXME: もっといい手段で伝える
        alert('更新成功！')
      } catch (e) {
        // TODO: Add error reporting
        console.error(e)
      } finally {
        lock(false)
      }
    },
    []
  )
  const onUpdateShowMetaCheckbox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // FIXME: ここきたない
      appStore.preferences.set(
        PREFERENCE_DISPLAY_META_ENABLED,
        e.target.checked
      )
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
    },
    []
  )
  const onUpdateEnableOGCard = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // FIXME: ここきたない
      appStore.preferences.set(PREFERENCE_DISPLAY_OGCARD, e.target.checked)
      appStore.savePreferences()
    },
    []
  )
  const onUpdateForceDarkTheme = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked
      if (checked) {
        appStore.enableForceDarkTheme()
      } else {
        appStore.disableForceDarkTheme()
      }
      appStore.preferences.set(PREFERENCE_FORCE_DARK_THEME, checked)
      appStore.savePreferences()
    },
    []
  )

  return useObserver(() => {
    const currentConfig = {
      showMetaEnabled:
        appStore.preferences.get(PREFERENCE_DISPLAY_META_ENABLED) || false,
      notificationEnabled:
        appStore.preferences.get(PREFERENCE_NOTICE_WHEN_MENTIONED) || false,
      ogcardEnabled:
        appStore.preferences.get(PREFERENCE_DISPLAY_OGCARD) || false,
      forceDarkTheme:
        appStore.preferences.get(PREFERENCE_FORCE_DARK_THEME) || false
    }
    return (
      <Setting
        updateDisabled={disabled}
        update={update}
        onUpdateShowMetaCheckbox={onUpdateShowMetaCheckbox}
        onUpdateEnableNotificationCheckBox={onUpdateEnableNotificationCheckBox}
        onUpdateEnableOGCard={onUpdateEnableOGCard}
        onUpdateForceDarkTheme={onUpdateForceDarkTheme}
        currentName={appStore.me ? appStore.me!.name : undefined}
        logout={appStore.logout.bind(appStore)}
        currentConfig={currentConfig}
      />
    )
  })
}
