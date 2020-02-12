import * as React from 'react'
import { useShortcut, useRelativeTimeRepresent } from './hooks'

type BrowserContext = {
  useRelativeTimeRepresent: typeof useRelativeTimeRepresent
  useShortcut: typeof useShortcut
}

const defaultValue = {
  useRelativeTimeRepresent: useRelativeTimeRepresent,
  useShortcut: useShortcut
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
