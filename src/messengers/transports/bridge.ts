import { detectScriptType } from '~/utils'

import { tabTransport } from './tab'
import type { Transport } from './types'
import { windowTransport } from './window'

const transport = tabTransport.available ? tabTransport : windowTransport

/**
 * Creates a "bridge transport" that can be used to communicate between
 * scripts where there isn't a direct messaging connection (ie. inpage <-> background).
 *
 * Compatible connections:
 * - ✅ Wallet <-> Inpage
 * - ✅ Background <-> Inpage
 * - ❌ Background <-> Wallet
 * - ❌ Wallet <-> Content Script
 * - ❌ Background <-> Content Script
 * - ❌ Content Script <-> Inpage
 */
export const bridgeTransport = {
  available: transport.available,
  name: 'bridgeTransport',
  async send(topic, payload, { id } = {}) {
    return transport.send(topic, payload, { id })
  },
  reply(topic, callback) {
    return transport.reply(topic, callback)
  },
} as const satisfies Transport

export function setupBridgeTransportRelay() {
  if (detectScriptType() !== 'contentScript') {
    throw new Error(
      '`setupBridgeTransportRelay` is only supported in Content Scripts.',
    )
  }

  // e.g. inpage -> content script -> background
  windowTransport.reply('*', async (payload, { topic, id }) => {
    if (!topic) return

    const topic_ = topic.replace('> ', '')
    const response = await tabTransport.send(topic_, payload, { id })
    return response
  })

  // e.g. background -> content script -> inpage
  tabTransport.reply('*', async (payload, { topic, id }) => {
    if (!topic) return

    const topic_: string = topic.replace('> ', '')
    const response = await windowTransport.send(topic_, payload, { id })
    return response
  })
}
