import * as React from 'react'
const { useCallback, useRef } = React

type Config = { showMeta: boolean }

export default ({
  updateDisabled,
  updateName,
  updateConfig,
  currentName,
  currentConfig,
  logout
}: {
  updateDisabled: boolean
  updateName: (n: string) => Promise<void>
  updateConfig: (showMeta: boolean) => void
  currentName?: string
  currentConfig: Config
  logout: () => void
}) => {
  const callback = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateConfig(refVia.current!.checked)
    updateName(refName.current!.value)
  }, [])
  const onLogout = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault()
    logout()
  }, [])
  const refName = useRef<HTMLInputElement>(null)
  const refVia = useRef<HTMLInputElement>(null)

  return (
    <div className="setting">
      <div className="settingItem__title">Settings</div>
      <form onSubmit={callback}>
        <div className="settingItem__subtitle">Account Settings</div>
        <label>
          <span className="settingItem__label__field">Name</span>
          <input type="text" ref={refName} defaultValue={currentName} />
        </label>
        <div className="settingItem__subtitle">Mozuku Settings</div>
        <label>
          <input
            type="checkbox"
            name="via"
            ref={refVia}
            defaultChecked={currentConfig.showMeta}
          />
          Show metadata in post (like via)
        </label>
        <input
          className="settingItem__submitButton"
          type="submit"
          value="Update"
          disabled={updateDisabled}
        />
      </form>
      <div className="settingItem__subtitle">Danger zone</div>
      <label>ほんとはメニュー用意してそこに入れたい</label>
      <input
        className="settingItem__submitButton alert"
        type="submit"
        value="Logout"
        onClick={onLogout}
      />
    </div>
  )
}
