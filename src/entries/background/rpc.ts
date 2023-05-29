import { type Chain, createClient, custom } from 'viem'
import { foundry, mainnet } from 'viem/chains'
import { rpc } from 'viem/utils'

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
          // @ts-expect-error – TODO: add upstream in viem
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

      const response = await new Promise((resolve, reject) => {
        walletMessenger.reply('pendingRequest', async ({ request }) => {
          if (request.id !== payload.id) return
          try {
            const response = await rpcClient.request(request)
            resolve(response)
            return response
          } catch (err) {
            reject(err)
            throw err
          }
        })
      })

      inpageMessenger.send('toggleWallet', { open: false })
      removePendingRequest(payload.id)

      return response
    }

    return rpcClient.request(payload as any)
  })
}
