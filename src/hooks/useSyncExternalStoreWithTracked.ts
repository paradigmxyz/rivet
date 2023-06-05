import { useRef } from 'react'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector.js'

import { deepEqual } from '~/utils'

export type UseSyncExternalStoreWithTrackedOptions<
  Snapshot = unknown,
  Selection = Snapshot,
> = {
  isEqual?: (a: Selection, b: Selection) => boolean
  selector?: (snapshot: Snapshot) => Selection
}

export function useSyncExternalStoreWithTracked<Snapshot, Selection = Snapshot>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  {
    isEqual = deepEqual,
    selector = (x) => x as unknown as Selection,
  }: UseSyncExternalStoreWithTrackedOptions<Snapshot, Selection> = {},
) {
  const trackedKeys = useRef<string[]>([])
  const result = useSyncExternalStoreWithSelector<Snapshot, Selection>(
    subscribe,
    getSnapshot,
    getSnapshot,
    selector,
    (a: any, b: any) => {
      if (isPlainObject(a) && isPlainObject(b) && trackedKeys.current.length) {
        for (const key of trackedKeys.current) {
          const equal = isEqual(get(a, key), get(b, key))
          if (!equal) return false
        }
        return true
      }
      return isEqual(a, b)
    },
  )

  if (isPlainObject(result)) {
    function track(result: Selection, prefix: string | undefined = undefined) {
      const trackedResult = { ...result }
      Object.defineProperties(
        trackedResult,
        Object.entries(trackedResult as { [key: string]: any }).reduce(
          (res, [key, value]) => {
            return {
              ...res,
              [key]: {
                configurable: false,
                enumerable: true,
                get: () => {
                  const newKey = `${prefix ? `${prefix}.` : ''}${key}`
                  if (isPlainObject(value)) return track(value, newKey)

                  if (trackedKeys.current.includes(newKey)) return value

                  trackedKeys.current.push(newKey)
                  return value
                },
              },
            }
          },
          {},
        ),
      )
      return trackedResult
    }
    return track(result)
  }

  return result
}

function get(obj: any, path: string, defaultValue = undefined) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj,
      )
  const result = path.includes('.')
    ? travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
    : obj[path]
  return result === undefined || result === obj ? defaultValue : result
}

function isPlainObject(obj: unknown) {
  return typeof obj === 'object' && !Array.isArray(obj)
}
