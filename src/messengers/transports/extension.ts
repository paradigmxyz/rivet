import type {
  CallbackFunction,
  ReplyMessage,
  SendMessage,
  Transport,
} from './types'
import { isValidReply, isValidSend } from './utils'

/**
 * Creates an "extension transport" that can be used to communicate between
 * scripts where `chrome.runtime` is defined.
 */
export const createExtensionTransport = <TConnection extends string>(
  connection: TConnection,
): Transport<TConnection> => ({
  available: Boolean(typeof chrome !== 'undefined' && chrome.runtime?.id),
  connection,
  async send<TPayload, TResponse>(
    topic: string,
    payload: TPayload,
    {
      connection: connection_,
      id,
    }: { connection?: string; id?: number | string } = {},
  ) {
    return new Promise<TResponse>((resolve, reject) => {
      const listener = (message: ReplyMessage<TResponse>) => {
        if (!isValidReply<TResponse>({ id, message, topic })) return

        chrome.runtime.onMessage.removeListener(listener)

        const { response: response_, error } = message.payload
        if (error) reject(new Error(error.message))
        resolve(response_)
      }
      chrome.runtime.onMessage.addListener(listener)

      chrome.runtime.sendMessage({
        connection: connection_ || connection,
        topic: `> ${topic}`,
        payload,
        id,
      })
    })
  },
  reply<TPayload, TResponse>(
    topic: string,
    callback: CallbackFunction<TPayload, TResponse>,
  ) {
    const listener = (
      message: SendMessage<TPayload>,
      sender: chrome.runtime.MessageSender,
    ) => {
      if (topic !== '*' && message.connection !== connection) return
      if (!isValidSend({ message, topic })) return

      const repliedTopic = message.topic.replace('>', '<')

      callback(message.payload, {
        connection: message.connection,
        id: message.id,
        sender,
        topic: message.topic,
      })
        .then((response) =>
          chrome.runtime.sendMessage({
            connection: message.connection,
            topic: repliedTopic,
            payload: { response },
            id: message.id,
          }),
        )
        .catch((error_) => {
          // Errors do not serialize properly over `chrome.runtime.sendMessage`, so
          // we are manually serializing it to an object.
          const error: Record<string, unknown> = {}
          for (const key of Object.getOwnPropertyNames(error_)) {
            error[key] = (<Error>error_)[<keyof Error>key]
          }
          chrome.runtime.sendMessage({
            connection: message.connection,
            topic: repliedTopic,
            payload: { error },
            id: message.id,
          })
        })
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  },
})
