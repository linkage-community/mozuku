import { useEffect } from 'react'

export type KeypressHandler = (ev: KeyboardEvent) => void
const handlers: Map<number, KeypressHandler> = new Map()
window.document.addEventListener('keypress', (ev: KeyboardEvent) => {
  if (handlers.has(ev.charCode)) {
    handlers.get(ev.charCode)!(ev)
  }
})

export const useShortcut = (charCode: number, callback: KeypressHandler) => {
  useEffect(() => {
    // 複数 callback を登録できないので、他で使われているキーを設定してはいけない。
    // 必要になったら制約を撤廃するが、いまのところこれで十分そう
    // あとで 同時に押すキーバインディングの対応をするかも. bit 演算で判別できるんでしたっけね
    handlers.set(charCode, callback)
    return () => {
      handlers.delete(charCode)
    }
  }, [])
}
