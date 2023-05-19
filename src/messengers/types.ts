import type { Transport, TransportSchema } from './transports/types'

export type MessengerSchema = TransportSchema

export type Messenger<
  TSchema extends MessengerSchema | undefined = undefined,
> = Transport<TSchema>
