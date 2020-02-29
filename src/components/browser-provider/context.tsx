import * as React from 'react'
import {
  useShortcut,
  useForceUpdatePerEverySecond,
  useCurrentTimeInMilliseconds,
  usePreventUnload
} from './hooks'

// TODO: 型が実装に依存しているのをやめる
type BrowserContext = {
  useShortcut: typeof useShortcut
  useForceUpdatePerEverySecond: typeof useForceUpdatePerEverySecond
  useCurrentTimeInMilliseconds: typeof useCurrentTimeInMilliseconds
  usePreventUnload: typeof usePreventUnload
}

const defaultValue: BrowserContext = {
  useShortcut,
  useForceUpdatePerEverySecond,
  useCurrentTimeInMilliseconds,
  usePreventUnload
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
