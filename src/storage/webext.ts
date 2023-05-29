export type WebextStorage = {
  clear(): Promise<void>
  getItem(key: string): Promise<any>
  setItem(key: string, value: unknown): Promise<void>
  removeItem(key: string): Promise<void>
  subscribe<TValue = unknown>(
    key: string,
    callback: (newValue: TValue, oldValue: TValue) => void,
  ): () => void
}

const noopStorage: typeof chrome.storage['local'] = {
  getBytesInUse: () => Promise.resolve(0),
  QUOTA_BYTES: 0,
  clear: () => Promise.resolve(),
  get: () => Promise.resolve({}),
  set: () => Promise.resolve(),
  setAccessLevel: () => Promise.resolve(),
  remove: () => Promise.resolve(),
  onChanged: {
    addRules: () => {},
    addListener: () => {},
    getRules: () => {},
    hasListener: () => false,
    hasListeners: () => false,
    removeListener: () => {},
    removeRules: () => {},
  },
}

/**
 * Async web extension storage.
 *
 * Only accessible in environments where `chrome.storage` is defined.
 */
export const webextStorage = {
  local: createWebextStorage({ type: 'local' }),
  session: createWebextStorage({ type: 'session' }),
} as const

function createWebextStorage({
  key: prefixKey = 'wagmi.wallet',
  type,
}: { key?: string; type: 'session' | 'local' }): WebextStorage {
  const storage = chrome.storage ? chrome.storage[type] : noopStorage

  const getKey = (key: string) => `${prefixKey}.${key}`

  return {
    async clear() {
      await storage.clear()
    },
    async getItem(key) {
      const result = await storage.get(getKey(key))
      return result[getKey(key)]
    },
    async setItem(key, value) {
      await storage.set({ [getKey(key)]: value })
    },
    async removeItem(key) {
      await storage.remove(getKey(key))
    },
    subscribe(key, callback) {
      const listener = (
        changes: Record<string, chrome.storage.StorageChange>,
      ) => {
        if (!changes[getKey(key)]) return
        const newValue = changes[getKey(key)]?.newValue
        const oldValue = changes[getKey(key)]?.oldValue
        callback(newValue, oldValue)
      }
      storage.onChanged.addListener(listener)
      return () => storage.onChanged.removeListener(listener)
    },
  }
}
