export type CallbackOptions = {
  /** The sender of the message. */
  sender: chrome.runtime.MessageSender
  /** The topic provided. */
  topic: string
  /** An optional scoped identifier. */
  id?: number | string
}

export type CallbackFunction<TPayload = unknown, TResponse = unknown> = (
  payload: TPayload,
  callbackOptions: CallbackOptions,
) => Promise<TResponse>

export type Source = 'background' | 'content' | 'inpage' | 'popup'

export type TransportSchema = Record<string, [unknown, unknown]>

export type Transport<
  TConnection extends string,
  TSchema extends TransportSchema = TransportSchema,
> = {
  /** Whether or not the transport is available in the context. */
  available: boolean
  /** Connection type. */
  connection: TConnection
  /** Sends a message to the `reply` handler. */
  send: <TTopic extends keyof TSchema>(
    /** A scoped topic that the `reply` will listen for. */
    topic: TTopic,
    /** The payload to send to the `reply` handler. */
    payload: TSchema extends TransportSchema ? TSchema[TTopic][0] : unknown,
    options?: {
      /** Identify & scope the request via an ID. */
      id?: string | number
    },
  ) => Promise<TSchema extends TransportSchema ? TSchema[TTopic][1] : unknown>
  /** Replies to `send`. */
  reply: <TTopic extends keyof TSchema,>(
    /** A scoped topic that was sent from `send`. */
    topic: TTopic,
    callback: CallbackFunction<
      TSchema extends TransportSchema ? TSchema[TTopic][0] : unknown,
      TSchema extends TransportSchema ? TSchema[TTopic][1] : unknown
    >,
  ) => () => void
}

export type SendMessage<TPayload = unknown> = {
  topic: string
  payload: TPayload
  id?: number | string
}

export type ReplyMessage<TResponse = unknown> = {
  topic: string
  id: number | string
  payload: { response: TResponse; error: Error }
}
