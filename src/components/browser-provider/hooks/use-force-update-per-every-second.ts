import { useEffect, useReducer } from 'react'

const timerSubscribers = new Set<() => void>()
const timer = () => {
  Array.from(timerSubscribers.values()).forEach(async f => {
    f()
  })
  window.setTimeout(timer, 1000)
}
timer()

export const useForceUpdatePerEverySecond = () => {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)
  useEffect(() => {
    const runner = () => {
      forceUpdate()
    }
    timerSubscribers.add(runner)
    return () => {
      timerSubscribers.delete(runner)
    }
  }, [])
  return
}
