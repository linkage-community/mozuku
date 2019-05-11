import * as React from 'react'

export default () => (
  <div className="setting">
    <div className="settingItem__title">Settings</div>
    <form>
      <div className="settingItem__subtitle">User Settings</div>
      <label>
        <span className="settingItem__label__field">Name</span><input type="text" />
      </label>
      <div className="settingItem__subtitle">Preferences on your device</div>
      <label>
        <input type="checkbox" name="via" />
        Show via in post
      </label>
      <label>
        <input type="checkbox" name="notification" />
        Show notification when reply received
      </label>
      <input className="settingItem__submitButton" type="submit" value="Update" />
    </form>
  </div>
)
