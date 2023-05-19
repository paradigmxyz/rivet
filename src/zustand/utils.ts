import {
  type PersistOptions,
  type StateStorage,
  persist,
} from 'zustand/middleware'
import {
  type Mutate,
  type StoreApi,
  createStore as create,
} from 'zustand/vanilla'

import * as stores from './index'

//////////////////////////////////////////////////////////////////
// Zustand Storages

export const persistStorage: StateStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return (await localStorage.get(key)) || null
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await localStorage.set(key, value)
  },
  removeItem: async (key: string): Promise<void> => {
    await localStorage.remove(key)
  },
}

export const noopStorage: StateStorage = {
  getItem: async (): Promise<string | null> => null,
  setItem: async (): Promise<void> => undefined,
  removeItem: async (): Promise<void> => undefined,
}

//////////////////////////////////////////////////////////////////
// Stores

type Initializer<TState> = Parameters<typeof persist<TState>>[0]
export type StoreWithPersist<TState> = Mutate<
  StoreApi<TState>,
  [['zustand/persist', unknown]]
> & {
  initializer: Initializer<TState>
}

export function createStore<TState>(
  initializer: Initializer<TState>,
  { persist: persistOptions }: { persist?: PersistOptions<TState> } = {},
) {
  const name = `zustand.${persistOptions?.name}`
  return Object.assign(
    create(
      persist(initializer, {
        ...persistOptions,
        name,
        getStorage: () => (persistOptions ? persistStorage : noopStorage),
      }),
    ),
    { initializer },
  )
}

async function syncStore({ store }: { store: StoreWithPersist<unknown> }) {
  if (!store.persist) return

  const persistOptions = store.persist.getOptions()
  const storageName = persistOptions.name || ''

  const listener = async (changedStore: StoreWithPersist<unknown>) => {
    if (changedStore === undefined) {
      // Retrieve the default state from the store initializer.
      const state = store.initializer(
        () => undefined,
        () => null,
        {} as any,
      )
      const version = persistOptions.version
      const newStore = persistOptions.serialize?.({ state, version })
      await localStorage.set(storageName, newStore)
    }
    store.persist.rehydrate()
  }

  localStorage.listen(storageName, listener)
}

export function syncStores() {
  Object.values(stores).forEach((store) => {
    if (typeof store === 'function') return
    if (!('persist' in store)) return
    if (store.persist) syncStore({ store: store as StoreWithPersist<unknown> })
  })
}
