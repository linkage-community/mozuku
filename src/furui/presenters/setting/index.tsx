import * as React from 'react'
const { useCallback, useRef } = React

import Config from '../../../config'

import * as styles from './setting.css'
import { useBrowserHooks } from '../../../components/browser-provider'

type TConfig = {
  showMetaEnabled: boolean
  notificationEnabled: boolean
  ogcardEnabled: boolean
  forceDarkTheme: boolean
  muteComputedApp: boolean
}

export default ({
  updateDisabled,
  update,
  onUpdateShowMetaCheckbox,
  onUpdateEnableNotificationCheckBox,
  onUpdateEnableOGCard,
  onUpdateForceDarkTheme,
  onUpdateMuteComputedApp,
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
  onUpdateMuteComputedApp: (e: React.ChangeEvent<HTMLInputElement>) => void
  currentName?: string
  currentConfig: TConfig
  logout: () => void
}) => {
  const { usePreventUnload } = useBrowserHooks()
  usePreventUnload(() => true)
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
      <div className={styles.title}>設定</div>
      <form onSubmit={callback}>
        <div className={styles.subtitle}>アカウント設定</div>
        <label>
          <span className={styles.text}>名前</span>
          <input type="text" ref={refName} defaultValue={currentName} />
        </label>
        <label>
          <span className={styles.text}>アバター</span>
          <input type="file" ref={refFile} accept="image/*" />
        </label>
        <input
          className={styles.submitButton}
          type="submit"
          value="更新"
          disabled={updateDisabled}
        />
      </form>
      <div className={styles.subtitle}>Mozuku Settings</div>
      <label>チェックを入れたらすぐに反映されます</label>
      <label>
        <input
          type="checkbox"
          name="via"
          onChange={onUpdateShowMetaCheckbox}
          checked={currentConfig.showMetaEnabled}
        />
        アプリケーションの表示
      </label>
      <label>
        <input
          type="checkbox"
          name="notification"
          onChange={onUpdateEnableNotificationCheckBox}
          checked={currentConfig.notificationEnabled}
        />
        バックグラウンドで開かれているときリプライを通知する
      </label>
      <label>
        <input
          type="checkbox"
          name="ogcard"
          onChange={onUpdateEnableOGCard}
          checked={currentConfig.ogcardEnabled}
        />
        共有されたウェブページのプレビューを表示する
      </label>
      <label>
        <input
          type="checkbox"
          name="ogcard"
          onChange={onUpdateForceDarkTheme}
          checked={currentConfig.forceDarkTheme}
        />
        ダークモードを強制する
      </label>
      <label>
        <input
          type="checkbox"
          name="mute-computed-app"
          onChange={onUpdateMuteComputedApp}
          checked={currentConfig.muteComputedApp}
        />
        機械的な投稿を無視する
      </label>
      <div className={styles.subtitle}>Danger zone</div>
      {/*ほんとはメニュー用意してそこに入れたい*/}
      <input
        className={`${styles.submitButton} ${styles.alert}`}
        type="submit"
        value="ログアウト"
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
