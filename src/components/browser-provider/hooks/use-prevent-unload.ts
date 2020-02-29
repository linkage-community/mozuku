import { useEffect } from 'react'

type PreventHandler = () => boolean
export const usePreventUnload = (handler: PreventHandler) => {
  useEffect(() => {
    const handlerWrapper = (event: BeforeUnloadEvent) => {
      const shouldPreventUnload = handler()
      if (shouldPreventUnload) {
        event.preventDefault()
        event.returnValue = 'dummy'
      }
    }
    window.addEventListener('beforeunload', handlerWrapper)
    return () => {
      window.removeEventListener('beforeunload', handlerWrapper)
    }
  }, [handler])
}
