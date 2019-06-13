import * as React from 'react'
const { useCallback, useRef } = React

import Config from '../../config'

import * as styles from './setting.css'

type TConfig = {
  showMetaEnabled: boolean
  notificationEnabled: boolean
  ogcardEnabled: boolean
  forceDarkTheme: boolean
}

export default ({
  updateDisabled,
  update,
  onUpdateShowMetaCheckbox,
  onUpdateEnableNotificationCheckBox,
  onUpdateEnableOGCard,
  onUpdateForceDarkTheme,
  currentName,
  currentConfig,
  logout
}: {
  updateDisabled: boolean
  update: ({ name, avatar }: { name?: string; avatar?: File }) => Promise<void>
  onUpdateShowMetaCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpdateEnableNotificationCheckBox: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  onUpdateEnableOGCard: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpdateForceDarkTheme: (e: React.ChangeEvent<HTMLInputElement>) => void
  currentName?: string
  currentConfig: TConfig
  logout: () => void
}) => {
  const refName = useRef<HTMLInputElement>(null)
  const refFile = useRef<HTMLInputElement>(null)
  const callback = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      await update({
        name: refName.current!.value,
        avatar: refFile.current!.files![0]
      })
      // prevent to upload twice
      refFile.current!.value = ''
    },
    []
  )
  const onLogout = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault()
    logout()
  }, [])

  return (
    <div className={styles.setting}>
      <div className={styles.title}>Settings</div>
      <form onSubmit={callback}>
        <div className={styles.subtitle}>Account Settings</div>
        <label>
          <span className={styles.text}>Name</span>
          <input type="text" ref={refName} defaultValue={currentName} />
        </label>
        <label>
          <span className={styles.text}>Avatar</span>
          <input type="file" ref={refFile} accept="image/*" />
        </label>
        <input
          className={styles.submitButton}
          type="submit"
          value="Update"
          disabled={updateDisabled}
        />
      </form>
      <div className={styles.subtitle}>Mozuku Settings</div>
      <label>チェック入れたら即時反映される</label>
      <label>
        <input
          type="checkbox"
          name="via"
          onChange={onUpdateShowMetaCheckbox}
          checked={currentConfig.showMetaEnabled}
        />
        Show metadata about posts (eg. used application)
      </label>
      <label>
        <input
          type="checkbox"
          name="notification"
          onChange={onUpdateEnableNotificationCheckBox}
          checked={currentConfig.notificationEnabled}
        />
        Notify if you are mentioned and the window (or tab) is hidden
      </label>
      <label>
        <input
          type="checkbox"
          name="ogcard"
          onChange={onUpdateEnableOGCard}
          checked={currentConfig.ogcardEnabled}
        />
        Show metadata about website links (by OGP)
      </label>
      <label>
        <input
          type="checkbox"
          name="ogcard"
          onChange={onUpdateForceDarkTheme}
          checked={currentConfig.forceDarkTheme}
        />
        Force Dark Theme
      </label>
      <div className={styles.subtitle}>Danger zone</div>
      <label>ほんとはメニュー用意してそこに入れたい</label>
      <input
        className={`${styles.submitButton} ${styles.alert}`}
        type="submit"
        value="Logout"
        onClick={onLogout}
      />
      <div className={styles.subtitle}>Built with ❤️</div>
      <ul>
        <li>Commit #{Config.source.commit || <i>undefined</i>}</li>
        <li>
          <a href={Config.source.repository}>Go to repository</a>
        </li>
      </ul>
    </div>
  )
}
