import { type EIP1193Provider, UnknownRpcError } from 'viem'

import { UserRejectedRequestError } from '~/errors'
import type { Messenger } from '~/messengers'
import type { RpcRequest } from '~/messengers/schema'
import { createEmitter } from '~/utils'

const providerCache = new Map<string, EIP1193Provider>()
export function getProvider({
  messenger,
  rpcUrl,
}: { messenger: Messenger; rpcUrl?: string }): EIP1193Provider {
  const cachedProvider = rpcUrl ? providerCache.get(rpcUrl) : undefined
  if (cachedProvider) return cachedProvider

  const emitter = createEmitter<{ chainChanged: { chainId: string } }>()

  let _id = 0

  messenger.reply('chainChanged', async (chainId) => {
    emitter.emit('chainChanged', { chainId })
  })

  const provider: EIP1193Provider = {
    on(eventName, cb: (...args: any[]) => void) {
      if (eventName === 'chainChanged')
        return emitter.on('chainChanged', (data) => cb(data.chainId))
    },
    removeListener() {},
    async request({ method, params }) {
      const id = _id++
      const { result, error, ...response } = await messenger.send(
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
        throw new UnknownRpcError(error)
      }
      return result
    },
  }
  if (rpcUrl) providerCache.set(rpcUrl, provider)
  return provider
}
