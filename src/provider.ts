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

  // @ts-expect-error
  const _emitter = createEmitter()

  let _id = 0

  const provider: EIP1193Provider = {
    on() {},
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
