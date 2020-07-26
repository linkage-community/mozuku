import * as React from 'react'

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  React.useEffect(() => {
    if (ref.current == null) return
    const outsideClickHandler = (e: any) => {
      if (e.currentTarget === null) return
      if (ref.current!.contains(e.target)) return
      handler()
    }
    window.addEventListener('click', outsideClickHandler)
    return () => {
      window.removeEventListener('click', outsideClickHandler)
    }
  }, [ref, handler])
}
