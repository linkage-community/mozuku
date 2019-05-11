import * as React from 'react'
const { useCallback, useRef } = React

export default ({
  updateDisabled,
  updateName,
  currentName,
  logout,
}: {
  updateDisabled: boolean
  updateName: (n: string) => Promise<void>
  currentName?: string,
  logout: () => void,
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
  const refVia = useRef<HTMLInputElement>(null)
  const refNotification = useRef<HTMLInputElement>(null)

  return (
    <div className="setting">
      <div className="settingItem__title">Settings</div>
      <form onSubmit={callback}>
        <div className="settingItem__subtitle">User Settings</div>
        <label>
          <span className="settingItem__label__field">Name</span>
          <input type="text" ref={refName} defaultValue={currentName} />
        </label>
        {/*
        <div className="settingItem__subtitle">Preferences on your device</div>
        <label>
          <input type="checkbox" name="via" ref={refVia} />
          Show via in post
        </label>
        <label>
          <input type="checkbox" name="notification" ref={refNotification} />
          Show notification when reply received
        </label>
        */}
        <input
          className="settingItem__submitButton"
          type="submit"
          value="Update"
          disabled={updateDisabled}
        />
      </form>
      <div className="settingItem__subtitle">Dangerous Zone</div>
      <label>ほんとはメニュー用意してそこに入れたい。</label>
      <input
          className="settingItem__submitButton"
          type="submit"
          value="Logout"
          onClick={onLogout}
        />
    </div>
  )
}
