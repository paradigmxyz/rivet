import { type Mutate, type StoreApi, create } from 'zustand'
import {
  type PersistOptions,
  type StateStorage,
  createJSONStorage,
  persist,
} from 'zustand/middleware'

import * as stores from './index'
import { webextStorage } from '~/storage'

//////////////////////////////////////////////////////////////////
// Zustand Storages

export const persistStorage: StateStorage = {
  ...webextStorage.local,
  getItem: async (key) => {
    return (await webextStorage.local.getItem(key)) || null
  },
}

export const noopStorage: StateStorage = {
  getItem: async () => null,
  setItem: async () => undefined,
  removeItem: async () => undefined,
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
        storage: createJSONStorage(() =>
          persistOptions ? persistStorage : noopStorage,
        ),
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
      await webextStorage.local.setItem(storageName, newStore)
    }
    store.persist.rehydrate()
  }

  webextStorage.local.subscribe(storageName, listener)
}

export function syncStores() {
  Object.values(stores).forEach((store) => {
    if ('persist' in store && (store as StoreWithPersist<unknown>).persist)
      syncStore({ store: store as StoreWithPersist<unknown> })
  })
}
