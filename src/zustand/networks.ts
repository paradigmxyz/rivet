import { createTrackedSelector } from 'react-tracked'
import { foundry } from 'viem/chains'

import { createStore } from './utils'

type Network = {
  chainId: number
  rpcUrl: string
}

export type NetworksStore = {
  network: Network
  networks: readonly Network[]
  updateNetwork: (updater: (network: Network) => Network) => void
}

const defaultNetwork = {
  chainId: foundry.id,
  rpcUrl: foundry.rpcUrls.default.http[0],
} satisfies Network

export const networksStore = createStore<NetworksStore>(
  (set) => ({
    network: defaultNetwork,
    networks: [defaultNetwork],
    updateNetwork(updater) {
      set((state) => {
        return {
          ...state,
          network: updater(state.network),
          networks: state.networks.map((network) => {
            const newNetwork = updater(network)
            if (newNetwork.rpcUrl === network.rpcUrl) return newNetwork
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

export const useNetworksStore = createTrackedSelector(networksStore)
