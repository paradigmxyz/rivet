import { type Chain, createClient, custom } from 'viem'
import { foundry, mainnet } from 'viem/chains'
import { rpc } from 'viem/utils'

import {
  createMessenger,
  createPendingRequestMessenger,
  createRpcMessenger,
} from '~/messengers'
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

const inpageMessener = createMessenger({
  connection: 'background <> inpage',
})
const pendingRequestMessenger = createPendingRequestMessenger({
  connection: 'background <> devtools',
})
const rpcMessenger = createRpcMessenger({ connection: 'background <> inpage' })

export function setupRpcHandler() {
  rpcMessenger.reply('request', async (payload) => {
    const { setPendingRequest, removePendingRequest } =
      pendingRequestsStore.getState()

    if (payload.method === 'eth_sendTransaction') {
      setPendingRequest(payload)

      console.log('test')
      inpageMessener.send('toggle-devtools', { open: true })

      const response = await new Promise((resolve, reject) => {
        pendingRequestMessenger.reply('pendingRequest', async ({ request }) => {
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

      inpageMessener.send('toggle-devtools', { open: false })
      removePendingRequest(payload.id)

      return response
    }

    return rpcClient.request(payload as any)
  })
}
