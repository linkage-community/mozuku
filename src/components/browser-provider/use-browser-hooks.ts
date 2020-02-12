import * as React from 'react'
import { BrowserContext } from './context'

export const useBrowserHooks = () => {
  return React.useContext(BrowserContext)
}
