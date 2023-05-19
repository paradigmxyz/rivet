export const localStorage = createStorage({ type: 'local' })
export const sessionStorage = createStorage({ type: 'session' })
export const syncStorage = createStorage({ type: 'sync' })

function createStorage({
  key: prefixKey = 'wagmi.wallet',
  type,
}: { key?: string; type: 'session' | 'local' | 'sync' }) {
  const storage = chrome.storage[type]

  const getKey = (key: string) => `${prefixKey}.${key}`

  return {
    async clear() {
      await storage.clear()
    },
    async get(key: string) {
      const result = await storage.get(getKey(key))
      return result[getKey(key)]
    },
    async set(key: string, value: unknown) {
      await storage.set({ [getKey(key)]: value })
    },
    async remove(key: string) {
      await storage.remove(getKey(key))
    },
    async listen<TValue = unknown>(
      key: string,
      callback: (newValue: TValue, oldValue: TValue) => void,
    ) {
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
