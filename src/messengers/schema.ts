import type { Address, EIP1193Parameters, EIP1474Methods } from 'viem'
import type { RpcResponse } from 'viem/utils'

import type { SessionsState } from '~/zustand'

export type RpcRequest = EIP1193Parameters<EIP1474Methods> & { id: number }

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
  pendingRequest: [
    payload: { request: RpcRequest; status: 'approved' | 'rejected' },
    response: void,
  ]
  request: [
    payload: { request: RpcRequest; rpcUrl?: string },
    response: RpcResponse,
  ]
  toggleWallet: [
    payload:
      | { open: boolean; useStorage?: never }
      | { open?: never; useStorage: true }
      | void,
    response: void,
  ]
}
