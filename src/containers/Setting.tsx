import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import { configStore } from '../stores'
import Setting from '../presenters/Setting';

export default () => {
  return useObserver(() => {
    return (
      <Setting />
    )
  })
}
