import { EventEmitter } from 'eventemitter3'
import { type EIP1193Provider, UnknownRpcError } from 'viem'

import {
  ProviderDisconnectedError,
  UnsupportedProviderMethodError,
  UserRejectedRequestError,
} from '~/errors'
import type { Messenger } from '~/messengers'
import type { RpcRequest } from '~/messengers/schema'

const providerCache = new Map<string, EIP1193Provider>()
export function getProvider({
  host,
  eventMessenger: eventMessenger_,
  requestMessenger,
  rpcUrl,
}: {
  host?: string
  eventMessenger: Messenger | Messenger[]
  requestMessenger: Messenger
  rpcUrl?: string
}): EIP1193Provider {
  const eventMessenger = Array.isArray(eventMessenger_)
    ? eventMessenger_
    : [eventMessenger_]

  const cacheKey = `${requestMessenger.connection}.${eventMessenger
    .map((m) => m.connection)
    .join('.')}.${rpcUrl}`
  const cachedProvider = rpcUrl ? providerCache.get(cacheKey) : undefined
  if (cachedProvider) return cachedProvider

  const emitter = new EventEmitter()

  // Workaround for id conflicts between inpage & wallet.
  let _id = Math.floor(Math.random() * 10000)

  function listen(messenger: Messenger) {
    messenger.reply('accountsChanged', async ({ accounts, sessions }) => {
      if (host && !sessions.find((session) => session.host === host)) return
      emitter.emit('accountsChanged', accounts)
    })

    messenger.reply('chainChanged', async ({ chainId, sessions }) => {
      if (host && !sessions.find((session) => session.host === host)) return
      emitter.emit('chainChanged', chainId)
    })

    messenger.reply('connect', async ({ chainId }) => {
      emitter.emit('connect', { chainId })
    })

    messenger.reply('disconnect', async () => {
      emitter.emit(
        'disconnect',
        new ProviderDisconnectedError(new Error('Disconnected.')),
      )
    })
  }
  eventMessenger.forEach(listen)

  const provider: EIP1193Provider = {
    on: emitter.on.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
    async request({ method, params }) {
      const id = _id++

      window.postMessage({
        type: 'openWallet',
        payload: { method },
      })

      const { result, error, ...response } = await requestMessenger.send(
        'request',
        {
          request: {
            method,
            params,
            id,
          } as RpcRequest,
          rpcUrl,
        },
        { id },
      )
      if (response.id !== id) return
      if (error) {
        if (error.code === UserRejectedRequestError.code)
          throw new UserRejectedRequestError(error)
        if (error.code === UnsupportedProviderMethodError.code)
          throw new UnsupportedProviderMethodError(error)
        throw new UnknownRpcError(error)
      }
      return result
    },
  }
  if (rpcUrl) providerCache.set(cacheKey, provider)
  return provider
}
