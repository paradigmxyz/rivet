import { useSyncExternalStoreWithTracked } from '~/hooks'

import { defaultChain, getPublicClient } from '../viem'
import { createStore } from './utils'

type Network = {
  chainId: number
  name: string
  rpcUrl: string
}

export type NetworkState = {
  network: Network
  networks: readonly Network[]
}
export type NetworkActions = {
  updateNetwork: (network: Partial<Network>) => Promise<void>
}
export type NetworkStore = NetworkState & NetworkActions

const defaultNetwork = {
  chainId: defaultChain.id,
  name: defaultChain.name,
  rpcUrl: defaultChain.rpcUrls.default.http[0],
} satisfies Network

export const networkStore = createStore<NetworkStore>(
  (set, get) => ({
    network: defaultNetwork,
    networks: [defaultNetwork],
    async updateNetwork(network) {
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
        return {
          ...state,
          network: updatedNetwork,
          networks: state.networks.map((network) => {
            if (state.network.rpcUrl === network.rpcUrl) return updatedNetwork
            return network
          }),
        }
      })
    },
  }),
  {
    persist: {
      name: 'networks',
      version: 0,
    },
  },
)

export const useNetwork = () =>
  useSyncExternalStoreWithTracked(networkStore.subscribe, networkStore.getState)
