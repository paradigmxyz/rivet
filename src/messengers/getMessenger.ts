import type { Schema } from './schema'
import { bridgeTransport } from './transports/bridge'
import { extensionTransport } from './transports/extension'
import { tabTransport } from './transports/tab'
import type { Transport } from './transports/types'
import { windowTransport } from './transports/window'

const transportsForConnection = {
  'wallet <> inpage': bridgeTransport,
  'background <> inpage': bridgeTransport,
  'background <> wallet': extensionTransport,
  'wallet <> contentScript': tabTransport,
  'background <> contentScript': tabTransport,
  'contentScript <> inpage': windowTransport,
} as const
type Connection = keyof typeof transportsForConnection

export type GetMessengerParameters = {
  connection: Connection
}
export type Messenger = Transport<Schema>

export function getMessenger({
  connection,
}: GetMessengerParameters): Messenger {
  return transportsForConnection[connection] as Messenger
}
