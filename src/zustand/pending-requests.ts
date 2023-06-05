import { useSyncExternalStoreWithTracked } from '~/hooks'
import type { RpcRequest } from '~/messengers/schema'

import { createStore } from './utils'

export type PendingRequestsState = {
  pendingRequests: RpcRequest[]
}
export type PendingRequestsActions = {
  addPendingRequest: (request: RpcRequest) => void
  removePendingRequest: (requestId: number) => void
}
export type PendingRequestsStore = PendingRequestsState & PendingRequestsActions

export const pendingRequestsStore = createStore<PendingRequestsStore>(
  (set) => ({
    pendingRequests: [],
    addPendingRequest(request) {
      set((state) => ({
        ...state,
        pendingRequests: [...state.pendingRequests, request],
      }))
    },
    removePendingRequest(requestId) {
      set((state) => ({
        ...state,
        pendingRequests: state.pendingRequests.filter(
          (request) => request.id !== requestId,
        ),
      }))
    },
  }),
  {
    persist: {
      name: 'pending-requests',
      version: 0,
    },
  },
)

export const usePendingRequests = () =>
  useSyncExternalStoreWithTracked(
    pendingRequestsStore.subscribe,
    pendingRequestsStore.getState,
  )
