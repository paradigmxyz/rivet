import { createTrackedSelector } from 'react-tracked'

import type { RpcRequest } from '~/messengers/schema'

import { createStore } from './utils'

export type PendingRequestsState = {
  pendingRequests: RpcRequest[]
}
export type PendingRequestsActions = {
  setPendingRequest: (request: RpcRequest) => void
  removePendingRequest: (requestId: number) => void
}
export type PendingRequestsStore = PendingRequestsState & PendingRequestsActions

export const pendingRequestsStore = createStore<PendingRequestsStore>(
  (set) => ({
    pendingRequests: [],
    setPendingRequest(request) {
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

export const usePendingRequests = createTrackedSelector(pendingRequestsStore)
