import * as React from 'react'
import { interfaces as IRiassumere } from 'riassumere'

import { WebpageMetaContext } from './context'

export const useWebpageMeta = (href: string) => {
  const { getDescription } = React.useContext(WebpageMetaContext)

  const [description, set] = React.useState<IRiassumere.ISummary | undefined>()

  React.useEffect(() => {
    getDescription(href)
      .then(c => set(c))
      .catch(e => e && console.error(e))
  }, [])

  return description
}
