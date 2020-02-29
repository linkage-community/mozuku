/**
 * 現在時刻を 1s 刻みに更新して提供する
 * Date.now() の副作用を隠蔽する
 */

import { useForceUpdatePerEverySecond } from './use-force-update-per-every-second'

export const useCurrentTimeInMilliseconds = () => {
  useForceUpdatePerEverySecond()
  return Date.now()
}
