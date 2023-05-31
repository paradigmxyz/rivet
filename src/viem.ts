import {
  type PublicClient,
  type Transport,
  type WalletClient,
  createPublicClient,
  createWalletClient,
  custom,
} from 'viem'
import { type Chain, foundry, mainnet } from 'viem/chains'

import { getMessenger } from '~/messengers'
import { createProvider } from '~/provider'

export const defaultChain = {
  ...mainnet,
  rpcUrls: foundry.rpcUrls,
} as const satisfies Chain

const provider = createProvider({
  messenger: getMessenger({ connection: 'background <> wallet' }),
})

export function getChain({ rpcUrl }: { rpcUrl: string }): Chain {
  return {
    ...defaultChain,
    rpcUrls: {
      default: {
        http: [rpcUrl],
      },
      public: {
        http: [rpcUrl],
      },
    },
  }
}

const publicClientCache = new Map()
export function getPublicClient({
  rpcUrl,
}: { rpcUrl: string }): PublicClient<Transport, Chain> {
  const cachedClient = publicClientCache.get(rpcUrl)
  if (cachedClient) return cachedClient

  const publicClient = createPublicClient({
    chain: getChain({ rpcUrl }),
    transport: custom(provider, { retryCount: 0 }),
  })
  publicClientCache.set(rpcUrl, publicClient)
  return publicClient
}

const walletClientCache = new Map()
export function getWalletClient({
  rpcUrl,
}: { rpcUrl: string }): WalletClient<Transport, Chain, undefined> {
  const cachedClient = walletClientCache.get(rpcUrl)
  if (cachedClient) return cachedClient

  const walletClient = createWalletClient({
    chain: getChain({ rpcUrl }),
    transport: custom(provider, { retryCount: 0 }),
  })
  walletClientCache.set(rpcUrl, walletClient)
  return walletClient
}
