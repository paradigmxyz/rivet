import type { EIP1193Provider } from 'viem'

import type { RpcMessenger } from './messengers/createRpcMessenger'
import { createEmitter } from './utils/emitter'

export function createProvider({
  messenger,
}: { messenger: RpcMessenger }): EIP1193Provider {
  // @ts-expect-error
  const _emitter = createEmitter()

  let _id = 0

  return {
    on() {},
    removeListener() {},
    async request({ method, params }) {
      const id = _id++
      const response = await messenger.send(
        'request',
        {
          method,
          params,
          id,
        },
        { id },
      )
      if (response.id !== id) return
      return response.result
    },
  }
}
