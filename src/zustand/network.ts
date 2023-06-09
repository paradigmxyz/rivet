import { useSyncExternalStoreWithTracked } from '~/hooks'

import { defaultChain, getPublicClient } from '../viem'
import { createStore } from './utils'

type RpcUrl = string
type Network = {
  blockTime: number
  chainId: number
  name: string
  rpcUrl: RpcUrl
}

export type NetworkState = {
  network: Network
  networks: Record<RpcUrl, Network>
  onboarded: boolean
}
export type NetworkActions = {
  upsertNetwork({
    network,
    rpcUrl,
  }: {
    network: Partial<Network>
    rpcUrl?: RpcUrl
  }): Promise<void>
  setOnboarded(onboarded: boolean): void
  switchNetwork(rpcUrl: RpcUrl): void
}
export type NetworkStore = NetworkState & NetworkActions

const defaultRpcUrl = defaultChain.rpcUrls.default.http[0]
const defaultNetwork = {
  blockTime: 0,
  chainId: defaultChain.id,
  name: defaultChain.name,
  rpcUrl: defaultRpcUrl,
} satisfies Network

export const networkStore = createStore<NetworkStore>(
  (set, get) => ({
    network: defaultNetwork,
    networks: {
      [defaultRpcUrl]: defaultNetwork,
    },
    onboarded: false,
    async upsertNetwork({ network, rpcUrl: rpcUrl_ }) {
      const prevRpcUrl = rpcUrl_ || get().network.rpcUrl
      const rpcUrl = network.rpcUrl || prevRpcUrl

      if (!network.chainId) {
        try {
          network.chainId = await getPublicClient({
            rpcUrl,
          }).getChainId()
        } catch {
          network.chainId = defaultChain.id
        }
      }

      set((state) => {
        const networks = state.networks
        networks[rpcUrl] = {
          ...(networks[rpcUrl] || defaultNetwork),
          ...network,
          rpcUrl,
        }

        return {
          ...state,
          ...(prevRpcUrl === state.network.rpcUrl && {
            network: networks[rpcUrl],
          }),
          networks,
        }
      })
    },
    setOnboarded(onboarded) {
      set((state) => {
        return {
          ...state,
          onboarded,
        }
      })
    },
    switchNetwork(rpcUrl) {
      set((state) => {
        return {
          ...state,
          network: state.networks[rpcUrl],
        }
      })
    },
  }),
  {
    persist: {
      name: 'network',
      version: 0,
    },
  },
)

export const useNetwork = () =>
  useSyncExternalStoreWithTracked(networkStore.subscribe, networkStore.getState)
