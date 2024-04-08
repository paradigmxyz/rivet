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
import { type Messenger, getMessenger } from '~/messengers'
import { buildChain } from '~/viem'
import {
  accountStore,
  networkStore,
  pendingRequestsStore,
  sessionsStore,
  settingsStore,
} from '~/zustand'

const inpageMessenger = getMessenger('background:inpage')
const walletMessenger = getMessenger('background:wallet')

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

        if (method === 'eth_sendTransaction')
          walletMessenger.send('transactionExecuted', undefined)

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

export function setupRpcHandler({ messenger }: { messenger: Messenger }) {
  messenger.reply('request', async ({ request, rpcUrl }, meta) => {
    const isInpage =
      meta.sender.tab &&
      !meta.sender.tab?.url?.includes('extension://') &&
      (!meta.sender.frameId || meta.sender.frameId === 0)
    const rpcClient = getRpcClient({ rpcUrl })

    const hasOnboarded = isInpage ? networkStore.getState().onboarded : rpcUrl
    if (!hasOnboarded)
      return {
        id: request.id,
        jsonrpc: '2.0',
        error: {
          code: UnsupportedProviderMethodError.code,
          message: 'Rivet has not been onboarded.',
        },
      } as RpcResponse

    const { bypassSignatureAuth, bypassTransactionAuth } =
      settingsStore.getState()
    // If the method is a "signable" method, request approval from the user.
    if (
      (request.method === 'eth_sendTransaction' && !bypassTransactionAuth) ||
      (request.method === 'eth_sign' && !bypassSignatureAuth) ||
      (request.method === 'eth_signTypedData_v4' && !bypassSignatureAuth) ||
      (request.method === 'personal_sign' && !bypassSignatureAuth)
    ) {
      const { addPendingRequest, removePendingRequest } =
        pendingRequestsStore.getState()

      addPendingRequest({ ...request, sender: meta.sender })

      try {
        const response = await new Promise((resolve, reject) => {
          walletMessenger.reply(
            'pendingRequest',
            async ({ request: pendingRequest, status }) => {
              if (pendingRequest.id !== request.id) return

              if (status === 'rejected') {
                resolve({
                  id: request.id,
                  jsonrpc: '2.0',
                  error: {
                    code: UserRejectedRequestError.code,
                    message: UserRejectedRequestError.message,
                    data: { request },
                  },
                } satisfies RpcResponse)
                return
              }

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
        removePendingRequest(request.id)
      }
    }

    if (isInpage && request.method === 'eth_requestAccounts') {
      const authorize = () => {
        const { accountsForRpcUrl } = accountStore.getState()
        const { network } = networkStore.getState()
        const { addSession } = sessionsStore.getState()

        const accounts = accountsForRpcUrl({
          activeFirst: true,
          rpcUrl: network.rpcUrl,
        })

        const host = new URL(meta.sender.url || '').host.replace('www.', '')
        const addresses = accounts.map((x) => x.address) as Address[]

        addSession({ session: { host } })
        inpageMessenger.send('connect', {
          chainId: numberToHex(network.chainId),
        })

        return {
          id: request.id,
          jsonrpc: '2.0',
          result: addresses,
        } as RpcResponse
      }

      const { bypassConnectAuth } = settingsStore.getState()
      if (bypassConnectAuth) return authorize()

      const { addPendingRequest, removePendingRequest } =
        pendingRequestsStore.getState()

      addPendingRequest({ ...request, sender: meta.sender })

      try {
        const response = await new Promise((resolve) => {
          walletMessenger.reply(
            'pendingRequest',
            async ({ request: pendingRequest, status }) => {
              if (pendingRequest.id !== request.id) return

              if (status === 'rejected') {
                resolve({
                  id: request.id,
                  jsonrpc: '2.0',
                  error: {
                    code: UserRejectedRequestError.code,
                    message: UserRejectedRequestError.message,
                    data: { request },
                  },
                } satisfies RpcResponse)
                return
              }

              resolve(authorize())
            },
          )
        })
        return response as RpcResponse
      } finally {
        removePendingRequest(request.id)
      }
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
