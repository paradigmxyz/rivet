import { type EIP1193Provider, UnknownRpcError } from 'viem'

import { UserRejectedRequestError } from '~/errors'
import type { Messenger } from '~/messengers'
import { createEmitter } from '~/utils'

export function createProvider({
  messenger,
}: { messenger: Messenger }): EIP1193Provider {
  // @ts-expect-error
  const _emitter = createEmitter()

  let _id = 0

  return {
    on() {},
    removeListener() {},
    async request({ method, params }) {
      const id = _id++
      const { result, error, ...response } = await messenger.send(
        'request',
        {
          method,
          params,
          id,
        } as any,
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
}
