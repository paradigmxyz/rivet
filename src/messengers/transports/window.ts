import type { SendMessage, Transport } from './types'
import { isValidReply, isValidSend } from './utils'

/**
 * Creates a "window transport" that can be used to communicate between
 * scripts where `window` is defined.
 */
export const createWindowTransport = <TConnection extends string>(
  connection: TConnection,
): Transport<TConnection> => ({
  available: typeof window !== 'undefined',
  connection,
  async send(topic, payload, { connection: connection_, id } = {}) {
    window.postMessage(
      {
        connection: connection_ || connection,
        topic: `> ${topic}`,
        payload,
        id,
      },
      '*',
    )
    return new Promise((resolve, reject) => {
      const listener = (event: MessageEvent) => {
        if (!isValidReply({ id, message: event.data, topic })) return
        if (event.source !== window) return

        window.removeEventListener('message', listener)

        const { response, error } = event.data.payload
        if (error) reject(new Error(error.message))
        resolve(response)
      }
      window.addEventListener('message', listener)
    })
  },
  reply(topic, callback, options) {
    const listener = async (event: MessageEvent<SendMessage<any>>) => {
      if (!isValidSend({ message: event.data, options, topic })) return

      const sender = event.source
      if (sender !== window) return

      let error
      let response
      try {
        response = await callback(event.data.payload, {
          connection: event.data.connection,
          topic: event.data.topic,
          sender,
          id: event.data.id,
        })
      } catch (error_) {
        error = error_
      }

      const repliedTopic = event.data.topic.replace('>', '<')
      window.postMessage({
        connection: event.data.connection,
        topic: repliedTopic,
        payload: { error, response },
        id: event.data.id,
      })
    }
    window.addEventListener('message', listener, false)
    return () => window.removeEventListener('message', listener)
  },
})
