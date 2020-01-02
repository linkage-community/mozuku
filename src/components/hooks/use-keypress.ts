import { useEffect } from 'react'

export type KeypressHandler = (ev: KeyboardEvent) => void
const handlers: Map<number, KeypressHandler> = new Map()

window.document.addEventListener('keypress', (ev: KeypressEvent) => {
  if (handlers.has(ev.charCode)) {
    handlers.get(ev.charCode)!(ev)
  }
})

function addShortcut(charCode: number, callback: KeypressHandler) {
  // 複数 callback 同じキーに設定しない (atarimae)
  // TODO: 同時に押していい感じに！ってキーバインディングしたいかもしれないのであとでやる かも
  handlers.set(charCode, callback)
}
function removeShortcut(charCode: number) {
  handlers.delete(charCode)
}

export const useShortcut = (charCode: number, callback: KeypressHandler) => {
  // custom react hook for shortcut
  useEffect(() => {
    addShortcut(charCode, callback)
    return () => {
      removeShortcut(charCode)
    }
  }, [])
}
