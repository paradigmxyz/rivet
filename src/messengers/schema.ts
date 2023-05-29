import type { RpcResponse } from 'viem/utils'

export type RpcRequest = { id: number; method: string; params?: any }

export type Schema = {
  extensionId: [payload: void, response: string]
  pendingRequest: [
    payload: { request: RpcRequest; status: 'approved' | 'rejected' },
    response: void,
  ]
  request: [payload: RpcRequest, response: RpcResponse]
  toggleWallet: [
    payload:
      | { open: boolean; useStorage?: never }
      | { open?: never; useStorage: true }
      | void,
    response: void,
  ]
}
