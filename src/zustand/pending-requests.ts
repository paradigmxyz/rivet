import { createTrackedSelector } from 'react-tracked'

import type { RpcRequest } from '~/messengers/schema'

import { createStore } from './utils'

export type PendingRequestsState = {
  pendingRequests: RpcRequest[]
  setPendingRequest: (request: RpcRequest) => void
  removePendingRequest: (requestId: number) => void
}

export const pendingRequestsStore = createStore<PendingRequestsState>(
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

export const usePendingRequestsStore =
  createTrackedSelector(pendingRequestsStore)
