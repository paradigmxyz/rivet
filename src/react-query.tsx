import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import {
  PersistQueryClientProvider,
  type PersistedClient,
} from '@tanstack/react-query-persist-client'
import type { ReactNode } from 'react'

import { webextStorage } from './storage'

type RecursiveDeps<deps extends readonly unknown[]> = deps extends [
  infer dep,
  ...infer rest,
]
  ? [dep] | [dep, ...RecursiveDeps<rest>]
  : []

export function createQueryKey<
  key extends string,
  deps extends readonly unknown[],
>(id: key) {
  return (deps?: RecursiveDeps<deps>) =>
    [id, ...(deps ? deps : [])] as unknown as [key, ...deps]
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: webextStorage.local,
  // Serialization is handled in `storage`.
  serialize: (x) => x as unknown as string,
  // Deserialization is handled in `storage`.
  deserialize: (x) => x as unknown as PersistedClient,
})

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            Boolean(
              // We only want to persist queries that have a `gcTime` of above zero.
              query.gcTime !== 0,
            ),
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
