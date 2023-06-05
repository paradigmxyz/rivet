import { useSyncExternalStoreWithTracked } from '~/hooks'

import { defaultChain, getPublicClient } from '../viem'
import { createStore } from './utils'

type RpcUrl = string
type Network = {
  blockNumber?: bigint
  chainId: number
  name: string
  rpcUrl: RpcUrl
}

export type NetworkState = {
  network: Network
  networks: Record<RpcUrl, Network>
}
export type NetworkActions = {
  setBlockNumber({
    blockNumber,
    rpcUrl,
  }: {
    blockNumber: bigint
    rpcUrl: RpcUrl
  }): void
  upsertNetwork({
    network,
    rpcUrl,
  }: {
    network: Partial<Network>
    rpcUrl: RpcUrl
  }): Promise<void>
  switchNetwork(rpcUrl: RpcUrl): void
}
export type NetworkStore = NetworkState & NetworkActions

const defaultRpcUrl = defaultChain.rpcUrls.default.http[0]
const defaultNetwork = {
  chainId: defaultChain.id,
  name: defaultChain.name,
  rpcUrl: defaultRpcUrl,
} satisfies Network

export const networkStore = createStore<NetworkStore>(
  (set) => ({
    network: defaultNetwork,
    networks: {
      [defaultRpcUrl]: defaultNetwork,
    },
    setBlockNumber({ blockNumber, rpcUrl }) {
      set((state) => {
        const network = {
          ...state.network,
          blockNumber,
        }
        return {
          ...state,
          ...(rpcUrl === state.network.rpcUrl && {
            network,
          }),
          networks: {
            ...state.networks,
            [state.network.rpcUrl]: network,
          },
        }
      })
    },
    async upsertNetwork({ network, rpcUrl }) {
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
          ...networks[rpcUrl],
          ...network,
          rpcUrl,
        }

        return {
          ...state,
          ...(network.rpcUrl === state.network.rpcUrl && {
            network: networks[rpcUrl],
          }),
          networks,
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
