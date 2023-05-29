export type WindowStorage = Omit<Storage, 'getItem' | 'setItem'> & {
  getItem<T>(key: string, defaultState?: T | null): T | null
  setItem<T>(key: string, value: T | null): void
}

const noopStorage: WindowStorage = {
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  length: 0,
  removeItem: () => undefined,
  setItem: () => undefined,
}

/**
 * Sync window storage.
 *
 * Only accessible in environments where `window` is defined.
 */
export const windowStorage = {
  local: createWindowStorage({ type: 'local' }),
  session: createWindowStorage({ type: 'session' }),
} as const

function createWindowStorage({
  key: prefixKey = 'wagmi.wallet',
  type,
}: { key?: string; type: 'session' | 'local' }): WindowStorage {
  if (typeof window === 'undefined') return noopStorage

  const storage = type === 'local' ? window.localStorage : window.sessionStorage

  const getKey = (key: string) => `${prefixKey}.${key}`

  return {
    ...storage,
    getItem(key, defaultState = null) {
      const value = storage.getItem(getKey(key))
      try {
        return value ? JSON.parse(value) : defaultState
      } catch (error) {
        console.warn(error)
        return defaultState
      }
    },
    setItem(key, value) {
      if (value === null) storage.removeItem(getKey(key))

      try {
        storage.setItem(getKey(key), JSON.stringify(value))
      } catch (err) {
        console.error(err)
      }
    },
    removeItem(key: string) {
      storage.remove(getKey(key))
    },
  }
}
