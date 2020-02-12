import * as React from 'react'
import { useShortcut, useForceUpdatePerEverySecond } from './hooks'

type BrowserContext = {
  useShortcut: typeof useShortcut
  useForceUpdatePerEverySecond: typeof useForceUpdatePerEverySecond
}

const defaultValue: BrowserContext = {
  useShortcut: useShortcut,
  useForceUpdatePerEverySecond: useForceUpdatePerEverySecond
}
// FIXME: BrowserContext.Provider に value を *必ず* 渡す必要があるので {} as any で無意味な値を突っこんでいるが、本当にこれでいいのか?
export const BrowserContext = React.createContext<BrowserContext>({} as any)

export const BrowserProvider: React.FC = ({ children }) => {
  return (
    <BrowserContext.Provider value={defaultValue}>
      {children}
    </BrowserContext.Provider>
  )
}
