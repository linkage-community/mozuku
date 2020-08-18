import * as React from 'react'
import { interfaces as IRiassumere } from 'riassumere'
import axios from 'axios'

type WebpageMetaContext = {
  getDescription: (href: string) => Promise<IRiassumere.ISummary | undefined>
}

const clawlCaches = new Map<string, IRiassumere.ISummary>()
const defaultValue: WebpageMetaContext = {
  getDescription: async (href) => {
    if (clawlCaches.has(href)) {
      return clawlCaches.get(href)
    }
    const r = await axios.get<IRiassumere.ISummary>(
      `https://ogp-syutoku-kun.vercel.app/api/v1/fetch`,
      {
        params: { url: href },
      }
    )
    clawlCaches.set(href, r.data)
    return r.data
  },
}
// FIXME: Provider に value を *必ず* 渡す必要があるので {} as any で無意味な値を突っこんでいるが、本当にこれでいいのか?
export const WebpageMetaContext = React.createContext<WebpageMetaContext>(
  {} as any
)
WebpageMetaContext.displayName = 'WebpageMetaContext'

export const WebpageMetaProvider: React.FC = ({ children }) => {
  return (
    <WebpageMetaContext.Provider value={defaultValue}>
      {children}
    </WebpageMetaContext.Provider>
  )
}
