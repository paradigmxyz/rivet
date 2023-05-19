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
  TSchema extends TransportSchema | undefined = undefined,
> = {
  /** Whether or not the transport is available in the context. */
  available: boolean
  /** Name of the transport */
  name: string
  /** Sends a message to the `reply` handler. */
  send: <
    TTopic extends keyof TSchema | string = TSchema extends Record<
      string,
      [unknown, unknown]
    >
      ? keyof TSchema
      : string,
    _Payload = TSchema extends TransportSchema ? TSchema[TTopic][0] : unknown,
    _Response = TSchema extends TransportSchema ? TSchema[TTopic][1] : unknown,
  >(
    /** A scoped topic that the `reply` will listen for. */
    topic: TTopic,
    /** The payload to send to the `reply` handler. */
    payload: _Payload,
    options?: {
      /** Identify & scope the request via an ID. */
      id?: string | number
    },
  ) => Promise<_Response>
  /** Replies to `send`. */
  reply: <
    TTopic extends keyof TSchema | string = TSchema extends Record<
      string,
      [unknown, unknown]
    >
      ? keyof TSchema
      : string,
    _Payload = TSchema extends TransportSchema ? TSchema[TTopic][0] : unknown,
    _Response = TSchema extends TransportSchema ? TSchema[TTopic][1] : unknown,
  >(
    /** A scoped topic that was sent from `send`. */
    topic: TTopic,
    callback: CallbackFunction<_Payload, _Response>,
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
