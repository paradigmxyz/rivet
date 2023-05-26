import {
  type CreateMessengerParameters,
  createMessenger,
} from './createMessenger'
import type { RpcRequest } from './createRpcMessenger'
import type { Messenger } from './types'

export type CreatePendingRequestMessengerParameters = CreateMessengerParameters
export type PendingRequestSchema = {
  pendingRequest: [
    payload: { request: RpcRequest; status: 'approved' | 'rejected' },
    response: void,
  ]
}
export type PendingRequestMessenger = Messenger<PendingRequestSchema>

export function createPendingRequestMessenger({
  connection,
}: CreateMessengerParameters): PendingRequestMessenger {
  return createMessenger<PendingRequestSchema>({ connection })
}
