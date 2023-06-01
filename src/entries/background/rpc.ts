import {
  type Chain,
  type Client,
  type Transport,
  createClient,
  custom,
} from 'viem'
import { type RpcResponse, rpc } from 'viem/utils'

import { UserRejectedRequestError } from '~/errors'
import { getMessenger } from '~/messengers'
import { buildChain } from '~/viem'
import { networkStore, pendingRequestsStore } from '~/zustand'

const clientCache = new Map()
export function getRpcClient({
  rpcUrl: rpcUrl_,
}: { rpcUrl?: string }): Client<Transport, undefined, Chain> {
  const rpcUrl = rpcUrl_ || networkStore.getState().network.rpcUrl

  const cachedClient = clientCache.get(rpcUrl)
  if (cachedClient) return cachedClient

  const client = createClient({
    chain: buildChain({ rpcUrl }),
    transport: custom({
      async request({ method, params, id }) {
        // Anvil doesn't support `personal_sign` – use `eth_sign` instead.
        if (method === 'personal_sign') {
          method = 'eth_sign'
          params = [params[1], params[0]]
        }

        const result = await rpc.http(rpcUrl, {
          body: {
            method,
            params,
            id,
          },
        })
        if ((result as { success?: boolean }).success === false)
          return {
            id,
            jsonrpc: '2.0',
            error: 'An unknown error occurred.',
          } as RpcResponse
        return result
      },
    }),
  })
  clientCache.set(rpcUrl, client)
  return client
}

const inpageMessenger = getMessenger({
  connection: 'background <> inpage',
})
const walletMessenger = getMessenger({
  connection: 'background <> wallet',
})

export function setupRpcHandler() {
  inpageMessenger.reply('request', async ({ request, rpcUrl }) => {
    const rpcClient = getRpcClient({ rpcUrl })

    const { setPendingRequest, removePendingRequest } =
      pendingRequestsStore.getState()

    // If the method is a "signable" method, request approval from the user.
    if (
      request.method === 'eth_sendTransaction' ||
      request.method === 'eth_sign' ||
      request.method === 'eth_signTypedData_v4' ||
      request.method === 'personal_sign'
    ) {
      setPendingRequest(request)

      inpageMessenger.send('toggleWallet', { open: true })

      try {
        const response = await new Promise((resolve, reject) => {
          walletMessenger.reply(
            'pendingRequest',
            async ({ request: pendingRequest, status }) => {
              if (pendingRequest.id !== request.id) return

              if (status === 'rejected')
                resolve({
                  id: request.id,
                  jsonrpc: '2.0',
                  error: {
                    code: UserRejectedRequestError.code,
                    message: UserRejectedRequestError.message,
                    data: { request },
                  },
                } satisfies RpcResponse)

              try {
                const response = await rpcClient.request(pendingRequest)
                resolve(response)
              } catch (err) {
                reject(err)
              }
            },
          )
        })
        return response as RpcResponse
      } finally {
        inpageMessenger.send('toggleWallet', { useStorage: true })
        removePendingRequest(request.id)
      }
    }

    return rpcClient.request(request as any)
  })
}
