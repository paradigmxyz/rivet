import type { Address } from 'viem'

import type { RpcRequest, RpcResponse } from '~/types/rpc'
import type { SessionsState } from '~/zustand'

export type Schema = {
  accountsChanged: [
    payload: { accounts: Address[]; sessions: SessionsState['sessions'] },
    response: void,
  ]
  chainChanged: [
    payload: { chainId: string; sessions: SessionsState['sessions'] },
    response: void,
  ]
  connect: [payload: { chainId: string }, response: void]
  disconnect: [payload: undefined, response: void]
  extensionId: [payload: void, response: string]
  injectProvider: [payload: void, response: void]
  pendingRequest: [
    payload: { request: RpcRequest; status: 'approved' | 'rejected' },
    response: void,
  ]
  ping: [payload: void, response: string]
  pushRoute: [payload: string, response: void]
  request: [
    payload: { request: RpcRequest; rpcUrl?: string },
    response: RpcResponse,
  ]
  toggleTheme: [payload: void, response: void]
  transactionExecuted: [payload: void, response: void]
}
