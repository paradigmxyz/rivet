import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'

import type { Hex, RpcTransactionRequest } from 'viem'
import { createStore } from './utils'

type BatchCalls = {
  calls: RpcTransactionRequest[]
  transactionHashes: Hex[]
}

export type BatchCallsState = {
  batch: Record<string, BatchCalls>
}
export type BatchCallsActions = {
  getBatchFromTransactionHash: (hash: Hex) => BatchCalls | undefined
  setBatch: (id: string, batch: BatchCalls) => void
}
export type BatchCallsStore = BatchCallsState & BatchCallsActions

export const batchCallsStore = createStore<BatchCallsStore>(
  (set, get) => ({
    batch: {},
    getBatchFromTransactionHash(hash: Hex) {
      const value = Object.values(get().batch).find(({ transactionHashes }) =>
        transactionHashes.includes(hash),
      )
      if (!value) return undefined
      return value
    },
    setBatch(id, batch) {
      set((state) => ({
        ...state,
        batch: {
          ...state.batch,
          [id]: batch,
        },
      }))
    },
  }),
  {
    persist: {
      name: 'batch-calls',
      version: 0,
    },
  },
)

export const useBatchCallsStore = () =>
  useSyncExternalStoreWithTracked(
    batchCallsStore.subscribe,
    batchCallsStore.getState,
  )
