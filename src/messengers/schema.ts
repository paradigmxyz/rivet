import type { Address, EIP1193Parameters, EIP1474Methods } from 'viem'
import type { RpcResponse } from 'viem/utils'

export type RpcRequest = EIP1193Parameters<EIP1474Methods> & { id: number }

export type Schema = {
  accountsChanged: [payload: Address[], response: void]
  chainChanged: [payload: string, response: void]
  connect: [payload: { chainId: string }, response: void]
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
