import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import { appStore, PREFERENCE_DISPLAY_META_ENABLED } from '../../furui/stores'
import seaClient from '../../furui/util/seaClient'
import { Setting } from '../../furui/presenters'
import timeline from '../../furui/stores/timeline'
import {
  PREFERENCE_NOTICE_WHEN_MENTIONED,
  PREFERENCE_DISPLAY_OGCARD,
  PREFERENCE_FORCE_DARK_THEME,
  PREFERENCE_MUTE_COMPUTED_APP
} from '../../furui/stores/app'
const { useState, useCallback } = React
import Container from '../_authenticated_container'

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
    (e: React.ChangeEvent<HTMLInputElement>) =>
      appStore.setPreference(PREFERENCE_DISPLAY_META_ENABLED, e.target.checked),
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
    (e: React.ChangeEvent<HTMLInputElement>) =>
      appStore.setPreference(PREFERENCE_DISPLAY_OGCARD, e.target.checked),
    []
  )
  const onUpdateForceDarkTheme = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // TODO: ここの分岐を移動する
      const checked = e.target.checked
      if (checked) {
        appStore.enableForceDarkTheme()
      } else {
        appStore.disableForceDarkTheme()
      }
      appStore.setPreference(PREFERENCE_FORCE_DARK_THEME, checked)
    },
    []
  )
  const onUpdateMuteComputedApp = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      appStore.setPreference(PREFERENCE_MUTE_COMPUTED_APP, e.target.checked),
    []
  )

  return useObserver(() => {
    const currentConfig = {
      showMetaEnabled: appStore.getPreference(PREFERENCE_DISPLAY_META_ENABLED),
      notificationEnabled: appStore.getPreference(
        PREFERENCE_NOTICE_WHEN_MENTIONED
      ),
      ogcardEnabled: appStore.getPreference(PREFERENCE_DISPLAY_OGCARD),
      forceDarkTheme: appStore.getPreference(PREFERENCE_FORCE_DARK_THEME),
      muteComputedApp: appStore.getPreference(PREFERENCE_MUTE_COMPUTED_APP)
    }
    return (
      <Container me={appStore.me}>
        <Setting
          updateDisabled={disabled}
          update={update}
          onUpdateShowMetaCheckbox={onUpdateShowMetaCheckbox}
          onUpdateEnableNotificationCheckBox={
            onUpdateEnableNotificationCheckBox
          }
          onUpdateEnableOGCard={onUpdateEnableOGCard}
          onUpdateForceDarkTheme={onUpdateForceDarkTheme}
          onUpdateMuteComputedApp={onUpdateMuteComputedApp}
          currentName={appStore.me ? appStore.me!.name : undefined}
          logout={appStore.logout.bind(appStore)}
          currentConfig={currentConfig}
        />
      </Container>
    )
  })
}
