import { createClient, custom } from 'viem'
import { type RpcResponse, rpc } from 'viem/utils'

import { UserRejectedRequestError } from '~/errors'
import { getMessenger } from '~/messengers'
import { localMainnet } from '~/viem'
import { pendingRequestsStore } from '~/zustand'

const rpcClient = createClient({
  chain: localMainnet,
  transport: custom({
    async request({ method, params, id }) {
      // Anvil doesn't support `personal_sign` – use `eth_sign` instead.
      if (method === 'personal_sign') {
        method = 'eth_sign'
        params = [params[1], params[0]]
      }

      return rpc.http(localMainnet.rpcUrls.default.http[0], {
        body: {
          method,
          params,
          id,
        },
      })
    },
  }),
})

const inpageMessenger = getMessenger({
  connection: 'background <> inpage',
})
const walletMessenger = getMessenger({
  connection: 'background <> wallet',
})

export function setupRpcHandler() {
  inpageMessenger.reply('request', async (payload) => {
    const { setPendingRequest, removePendingRequest } =
      pendingRequestsStore.getState()

    // If the method is a "signable" method, request approval from the user.
    if (
      payload.method === 'eth_sendTransaction' ||
      payload.method === 'eth_sign' ||
      payload.method === 'eth_signTypedData_v4' ||
      payload.method === 'personal_sign'
    ) {
      setPendingRequest(payload)

      inpageMessenger.send('toggleWallet', { open: true })

      try {
        const response = await new Promise((resolve, reject) => {
          walletMessenger.reply(
            'pendingRequest',
            async ({ request, status }) => {
              if (request.id !== payload.id) return

              if (status === 'rejected')
                resolve({
                  id: payload.id,
                  jsonrpc: '2.0',
                  error: {
                    code: UserRejectedRequestError.code,
                    message: UserRejectedRequestError.message,
                    data: { request },
                  },
                } satisfies RpcResponse)

              try {
                const response = await rpcClient.request(request)
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
        removePendingRequest(payload.id)
      }
    }

    return rpcClient.request(payload as any)
  })
}
