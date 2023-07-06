import {
  type Address,
  type Chain,
  type Client,
  type Transport,
  createClient,
  custom,
  numberToHex,
} from 'viem'
import { type RpcResponse, rpc } from 'viem/utils'

import {
  UnsupportedProviderMethodError,
  UserRejectedRequestError,
} from '~/errors'
import { getMessenger } from '~/messengers'
import { buildChain } from '~/viem'
import {
  accountStore,
  networkStore,
  pendingRequestsStore,
  sessionsStore,
} from '~/zustand'

const clientCache = new Map()
export function getRpcClient({
  rpcUrl: rpcUrl_,
}: { rpcUrl?: string }): Client<Transport, Chain, undefined> {
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

        const response = await rpc.http(rpcUrl, {
          body: {
            method,
            params,
            id,
          },
          timeout: 5_000,
        })
        if ((response as { success?: boolean }).success === false)
          return {
            id,
            jsonrpc: '2.0',
            error: 'An unknown error occurred.',
          } as RpcResponse
        return response
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
  inpageMessenger.reply('request', async ({ request, rpcUrl }, meta) => {
    const isInpage = !meta.sender.frameId || meta.sender.frameId === 0
    const rpcClient = getRpcClient({ rpcUrl })

    const hasOnboarded = isInpage ? networkStore.getState().onboarded : rpcUrl

    if (!hasOnboarded)
      return {
        id: request.id,
        jsonrpc: '2.0',
        error: {
          code: UnsupportedProviderMethodError.code,
          message: 'Dev Wallet has not been onboarded.',
        },
      } as RpcResponse

    // If the method is a "signable" method, request approval from the user.
    if (
      request.method === 'eth_sendTransaction' ||
      request.method === 'eth_sign' ||
      request.method === 'eth_signTypedData_v4' ||
      request.method === 'personal_sign'
    ) {
      const { addPendingRequest, removePendingRequest } =
        pendingRequestsStore.getState()

      addPendingRequest(request)

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

    if (isInpage && request.method === 'eth_requestAccounts') {
      const { accountsForRpcUrl } = accountStore.getState()
      const { network } = networkStore.getState()

      const accounts = accountsForRpcUrl({
        activeFirst: true,
        rpcUrl: network.rpcUrl,
      })

      const host = new URL(meta.sender.url || '').host
      const addresses = accounts.map((x) => x.address) as Address[]

      const { addSession } = sessionsStore.getState()
      addSession({ session: { host } })
      inpageMessenger.send('connect', { chainId: numberToHex(network.chainId) })

      return {
        id: request.id,
        jsonrpc: '2.0',
        result: addresses,
      } as RpcResponse
    }

    if (isInpage && request.method === 'eth_accounts') {
      const { accountsForRpcUrl } = accountStore.getState()
      const { network } = networkStore.getState()

      const accounts = accountsForRpcUrl({
        activeFirst: true,
        rpcUrl: network.rpcUrl,
      })

      const host = new URL(meta.sender.url || '').host

      const { getSession } = sessionsStore.getState()
      const session = getSession({ host })

      const addresses = session
        ? (accounts.map((x) => x.address) as Address[])
        : []

      return {
        id: request.id,
        jsonrpc: '2.0',
        result: addresses,
      } as RpcResponse
    }

    return rpcClient.request(request)
  })
}
