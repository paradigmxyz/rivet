import {
  type CreateMessengerParameters,
  createMessenger,
} from './createMessenger'
import type { Messenger } from './types'
import type { RpcResponse } from 'viem/utils'

export type RpcRequest = { id: number; method: string; params?: any }

export type CreateRpcMessengerParameters = CreateMessengerParameters
export type RpcSchema = {
  request: [payload: RpcRequest, response: RpcResponse]
}
export type RpcMessenger = Messenger<RpcSchema>

export function createRpcMessenger({
  connection,
}: CreateMessengerParameters): RpcMessenger {
  return createMessenger<RpcSchema>({ connection })
}
