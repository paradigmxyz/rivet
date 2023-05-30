import { createPublicClient, createWalletClient, custom } from 'viem'
import { type Chain, foundry, mainnet } from 'viem/chains'

import { getMessenger } from '~/messengers'
import { createProvider } from '~/provider'

export const localMainnet = {
  ...mainnet,
  rpcUrls: foundry.rpcUrls,
} as const satisfies Chain

const provider = createProvider({
  messenger: getMessenger({ connection: 'background <> wallet' }),
})

export const publicClient = createPublicClient({
  chain: localMainnet,
  transport: custom(provider, { retryCount: 0 }),
})

export const walletClient = createWalletClient({
  chain: localMainnet,
  transport: custom(provider, { retryCount: 0 }),
})
