import { useSyncExternalStoreWithTracked } from '~/hooks'

import { defaultChain, getPublicClient } from '../viem'
import { createStore } from './utils'

type RpcUrl = string
type Network = {
  chainId: number
  name: string
  rpcUrl: RpcUrl
}

export type NetworkState = {
  network: Network
  networks: Record<RpcUrl, Network>
}
export type NetworkActions = {
  setNetwork(network: Partial<Network>): Promise<void>
}
export type NetworkStore = NetworkState & NetworkActions

const defaultRpcUrl = defaultChain.rpcUrls.default.http[0]
const defaultNetwork = {
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
    async setNetwork(network) {
      const updatedNetwork = {
        ...get().network,
        ...network,
      }
      if (network.rpcUrl && !network.chainId) {
        try {
          updatedNetwork.chainId = await getPublicClient({
            rpcUrl: network.rpcUrl,
          }).getChainId()
        } catch {}
      }

      set((state) => {
        const networks = state.networks
        delete networks[state.network.rpcUrl]
        networks[updatedNetwork.rpcUrl] = updatedNetwork

        return {
          ...state,
          network: updatedNetwork,
          networks,
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
