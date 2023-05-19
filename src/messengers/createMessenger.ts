import { bridgeTransport } from './transports/bridge'
import { extensionTransport } from './transports/extension'
import { tabTransport } from './transports/tab'
import { windowTransport } from './transports/window'
import type { Messenger, MessengerSchema } from './types'

const transportsForConnection = {
  'popup <> inpage': bridgeTransport,
  'background <> inpage': bridgeTransport,
  'background <> popup': extensionTransport,
  'popup <> contentScript': tabTransport,
  'background <> contentScript': tabTransport,
  'contentScript <> inpage': windowTransport,
} as const
type Connection = keyof typeof transportsForConnection

export type CreateMessengerParameters = {
  connection: Connection
}

export function createMessenger<
  TSchema extends MessengerSchema | undefined = undefined,
>({ connection }: CreateMessengerParameters): Messenger<TSchema> {
  return transportsForConnection[connection] as Messenger<TSchema>
}
