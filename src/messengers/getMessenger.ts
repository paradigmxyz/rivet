import type { Schema } from './schema'
import { createBridgeTransport } from './transports/bridge'
import { createExtensionTransport } from './transports/extension'
import { createTabTransport } from './transports/tab'
import type { Transport } from './transports/types'
import { createWindowTransport } from './transports/window'

const transportsForConnection = {
  'wallet:inpage': createBridgeTransport('wallet:inpage'),
  'background:inpage': createBridgeTransport('background:inpage'),
  'background:wallet': createExtensionTransport('background:wallet'),
  'wallet:contentScript': createTabTransport('wallet:contentScript'),
  'background:contentScript': createTabTransport('background:contentScript'),
  'contentScript:inpage': createWindowTransport('contentScript:inpage'),
} as const
type Connection = keyof typeof transportsForConnection

export type Messenger = Transport<Connection, Schema>

export function getMessenger(connection: Connection): Messenger {
  return transportsForConnection[connection] as Messenger
}
