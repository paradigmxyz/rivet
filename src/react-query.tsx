import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { type InfiniteData, QueryClient } from '@tanstack/react-query'
import {
  PersistQueryClientProvider,
  type PersistedClient,
} from '@tanstack/react-query-persist-client'
import type { ReactNode } from 'react'

import { webextStorage } from './storage'

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

////////////////////////////////////////////////////////////////////////
// Utils

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

export function filterInfiniteQueryData<data extends unknown[]>(
  predicate: (page: data[number]) => boolean,
) {
  return (prev: InfiniteData<data> | undefined) => {
    const pages = prev?.pages
      .map((page) => page.filter(predicate))
      .filter((page) => page.length > 0)! as data[]
    return {
      ...prev,
      pageParams: Array.from({ length: pages!.length }, (_, i) => i),
      pages,
    }
  }
}

export function updateInfiniteQueryData<data extends unknown[]>(data: data) {
  return (prev: InfiniteData<data> | undefined) => {
    if (!prev) return
    const [first, ...rest] = prev.pages
    if (first.length > rest?.[rest.length - 1]?.length)
      return {
        ...prev,
        pageParams: [...prev.pageParams, prev.pageParams.length],
        pages: [data, first, ...rest],
      }

    return {
      ...prev,
      pages: [[...data, ...first], ...rest],
    }
  }
}
