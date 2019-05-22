import * as React from 'react'
const { useCallback, useRef } = React

import Config from '../config'

type TConfig = {
  showMetaEnabled: boolean
  notificationEnabled: boolean
  ogcardEnabled: boolean
}

export default ({
  updateDisabled,
  updateName,
  onUpdateShowMetaCheckbox,
  onUpdateEnableNotificationCheckBox,
  onUpdateEnableOGCard,
  currentName,
  currentConfig,
  logout
}: {
  updateDisabled: boolean
  updateName: (n: string) => Promise<void>
  onUpdateShowMetaCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpdateEnableNotificationCheckBox: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  onUpdateEnableOGCard: (e: React.ChangeEvent<HTMLInputElement>) => void
  currentName?: string
  currentConfig: TConfig
  logout: () => void
}) => {
  const callback = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateName(refName.current!.value)
  }, [])
  const onLogout = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault()
    logout()
  }, [])
  const refName = useRef<HTMLInputElement>(null)

  return (
    <div className="setting">
      <div className="settingItem__title">Settings</div>
      <form onSubmit={callback}>
        <div className="settingItem__subtitle">Account Settings</div>
        <label>
          <span className="settingItem__label__field">Name</span>
          <input type="text" ref={refName} defaultValue={currentName} />
        </label>
        <input
          className="settingItem__submitButton"
          type="submit"
          value="Update"
          disabled={updateDisabled}
        />
      </form>
      <div className="settingItem__subtitle">Mozuku Settings</div>
      <label>チェック入れたら即時反映される</label>
      <label>
        <input
          type="checkbox"
          name="via"
          onChange={onUpdateShowMetaCheckbox}
          checked={currentConfig.showMetaEnabled}
        />
        Show metadata in post (like via)
      </label>
      <label>
        <input
          type="checkbox"
          name="notification"
          onChange={onUpdateEnableNotificationCheckBox}
          checked={currentConfig.notificationEnabled}
        />
        Notificate when you mentioned in background
      </label>
      <label>
        <input
          type="checkbox"
          name="ogcard"
          onChange={onUpdateEnableOGCard}
          checked={currentConfig.ogcardEnabled}
        />
        Show website metadata in post (link OGP)
      </label>
      <div className="settingItem__subtitle">Danger zone</div>
      <label>ほんとはメニュー用意してそこに入れたい</label>
      <input
        className="settingItem__submitButton alert"
        type="submit"
        value="Logout"
        onClick={onLogout}
      />
      <div className="settingItem__subtitle">Built with ❤️</div>
      <ul>
        <li>Commit #{Config.source.commit || <i>undefined</i>}</li>
        <li><a href={Config.source.repository}>Go to repository</a></li>
      </ul>
    </div>
  )
}
