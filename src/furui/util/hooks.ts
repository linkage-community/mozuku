import { useState, useEffect } from 'react'
import riassumere, { interfaces as IRiassumere } from 'riassumere'

const clawlCaches = new Map<string, IRiassumere.ISummary>()
export const useOGP = (href: string) => {
  const [result, setResult] = useState<IRiassumere.ISummary | undefined>()

  useEffect(() => {
    const main = async () => {
      if (clawlCaches.has(href)) {
        return setResult(clawlCaches.get(href))
      }
      const r = await riassumere(href)
      // あり得ないので無視
      if (Array.isArray(r)) return
      clawlCaches.set(href, r)
      return setResult(r)
    }
    main().catch(() => {})
  }, [])

  return result
}
