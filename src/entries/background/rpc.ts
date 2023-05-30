import { type Chain, createClient, custom } from 'viem'
import { foundry, mainnet } from 'viem/chains'
import { rpc, type RpcRequest, type RpcResponse } from 'viem/utils'

import { UserRejectedRequestError } from '~/errors'
import { getMessenger } from '~/messengers'
import { pendingRequestsStore } from '~/zustand'

const anvilMainnet = {
  ...mainnet,
  rpcUrls: foundry.rpcUrls,
} as const satisfies Chain

const rpcClient = createClient({
  chain: anvilMainnet,
  transport: custom({
    async request({ method, params, id }) {
      return rpc.http(anvilMainnet.rpcUrls.default.http[0], {
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

    if (payload.method === 'eth_sendTransaction') {
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
                    data: { request }
                  },
                } satisfies RpcResponse)

              try {
                const response = await rpcClient.request(request as RpcRequest)
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
