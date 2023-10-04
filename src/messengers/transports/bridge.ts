import { createTabTransport } from './tab'
import type { Transport } from './types'
import { createWindowTransport } from './window'

const windowTransport = createWindowTransport('contentScript:inpage')
const tabTransport = createTabTransport('background:contentScript')

const transport = tabTransport.available ? tabTransport : windowTransport

/**
 * Creates a "bridge transport" that can be used to communicate between
 * scripts where there isn't a direct messaging connection (ie. inpage <-> background).
 */
export const createBridgeTransport = <TConnection extends string>(
  connection: TConnection,
): Transport<TConnection> => ({
  available: transport.available,
  connection,
  async send(topic, payload, { id } = {}) {
    return transport.send(topic, payload, { connection, id })
  },
  reply(topic, callback) {
    return transport.reply(topic, callback, { connection })
  },
})

export function setupBridgeTransportRelay() {
  // inpage -> content script -> background
  windowTransport.reply('*', async (payload, { connection, topic, id }) => {
    if (!topic) return

    const topic_ = topic.replace('> ', '')
    const response = await tabTransport.send(topic_, payload, {
      id,
      connection,
    })
    return response
  })

  // background -> content script -> inpage
  tabTransport.reply('*', async (payload, { connection, topic, id }) => {
    if (!topic) return

    const topic_: string = topic.replace('> ', '')
    const response = await windowTransport.send(topic_, payload, {
      id,
      connection,
    })
    return response
  })
}
