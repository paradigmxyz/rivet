import { createTrackedSelector } from 'react-tracked'

import { defaultChain, getPublicClient } from '../viem'
import { createStore } from './utils'

type Network = {
  chainId: number
  name: string
  rpcUrl: string
}

export type NetworkStore = {
  network: Network
  networks: readonly Network[]
  updateNetwork: (network: Partial<Network>) => Promise<void>
}

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

export const useNetwork = createTrackedSelector(networkStore)
