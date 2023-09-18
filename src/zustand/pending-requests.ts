import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'
import type { RpcRequest } from '~/messengers/schema'

import { createStore } from './utils'

export type PendingRequest = RpcRequest & {
  sender?: chrome.runtime.MessageSender
}

export type PendingRequestsState = {
  pendingRequests: PendingRequest[]
}
export type PendingRequestsActions = {
  addPendingRequest: (request: PendingRequest) => void
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

export const usePendingRequestsStore = () =>
  useSyncExternalStoreWithTracked(
    pendingRequestsStore.subscribe,
    pendingRequestsStore.getState,
  )
