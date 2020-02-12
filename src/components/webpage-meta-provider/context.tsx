import * as React from 'react'
import riassumere, { interfaces as IRiassumere } from 'riassumere'

type WebpageMetaContext = {
  getDescription: (href: string) => Promise<IRiassumere.ISummary | undefined>
}

const clawlCaches = new Map<string, IRiassumere.ISummary>()
const defaultValue: WebpageMetaContext = {
  getDescription: async href => {
    if (clawlCaches.has(href)) {
      return clawlCaches.get(href)
    }
    const r = await riassumere(href)
    // あり得ないので無視
    if (Array.isArray(r)) return
    clawlCaches.set(href, r)
    return r
  }
}
// FIXME: Provider に value を *必ず* 渡す必要があるので {} as any で無意味な値を突っこんでいるが、本当にこれでいいのか?
export const WebpageMetaContext = React.createContext<WebpageMetaContext>(
  {} as any
)

export const WebpageMetaProvider: React.FC = ({ children }) => {
  return (
    <WebpageMetaContext.Provider value={defaultValue}>
      {children}
    </WebpageMetaContext.Provider>
  )
}
