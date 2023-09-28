import * as chains from 'viem/chains'

import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'
import { getClient } from '~/viem'

import { uniqBy } from 'remeda'
import { createStore } from './utils'

type RpcUrl = string
export type Network = {
  blockTime: number
  forkBlockNumber: bigint
  chainId: number
  name: string
  rpcUrl: RpcUrl
}

export type NetworkState = {
  network: Network
  networks: readonly Network[]
  onboarded: boolean
}
export type NetworkActions = {
  removeNetwork(rpcUrl: RpcUrl): void
  setOnboarded(onboarded: boolean): void
  switchNetwork(rpcUrl: RpcUrl): void
  upsertNetwork({
    network,
    rpcUrl,
  }: {
    network: Partial<Network>
    rpcUrl?: RpcUrl
  }): Promise<void>
}
export type NetworkStore = NetworkState & NetworkActions

export const defaultNetwork = {
  blockTime: 0,
  forkBlockNumber: 0n,
  chainId: -1,
  name: '',
  rpcUrl: '',
} satisfies Network

export const networkStore = createStore<NetworkStore>(
  (set, get) => ({
    network: defaultNetwork,
    networks: [defaultNetwork],
    onboarded: false,
    removeNetwork(rpcUrl) {
      set((state) => {
        const networks = state.networks.filter((x) => x.rpcUrl !== rpcUrl)
        return {
          ...state,
          network:
            rpcUrl === state.network.rpcUrl ? networks[0] : state.network,
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
        const network = state.networks.find(
          (network) => network.rpcUrl === rpcUrl,
        )
        return {
          ...state,
          network,
        }
      })
    },
    async upsertNetwork({ network: network_, rpcUrl: rpcUrl_ }) {
      const rpcUrl = network_.rpcUrl || rpcUrl_ || get().network.rpcUrl

      const chainId = await (async () => {
        if (network_.chainId) return network_.chainId
        try {
          return await getClient({
            rpcUrl,
          }).getChainId()
        } catch {
          return defaultNetwork.chainId
        }
      })()
      const forkBlockNumber = await (async () => {
        if (network_.forkBlockNumber) return network_.forkBlockNumber
        try {
          return await getClient({
            rpcUrl,
          }).getBlockNumber()
        } catch {
          return defaultNetwork.forkBlockNumber
        }
      })()
      const name = (() => {
        if (network_.name) return network_.name
        const chain = Object.values(chains).find(
          (chain) => chain.id === chainId,
        )
        return chain?.name || ''
      })()

      set((state) => {
        const networks = [...state.networks]
        const index = networks.findIndex(
          (network) => network.rpcUrl === rpcUrl_,
        )

        const network = {
          ...(index >= 0 ? networks[index] : defaultNetwork),
          ...network_,
          chainId,
          forkBlockNumber,
          name,
        }
        if (index >= 0) networks[index] = network
        else networks.push(network)

        return {
          ...state,
          ...(rpcUrl === state.network.rpcUrl && {
            network,
          }),
          networks: uniqBy(networks, (x) => x.rpcUrl),
        }
      })
    },
  }),
  {
    persist: {
      name: 'network',
      version: 1,
      migrate,
    },
  },
)

export const useNetworkStore = () =>
  useSyncExternalStoreWithTracked(networkStore.subscribe, networkStore.getState)

///////////////////////////////////////////////////////////////////////////////////////
// Migrations

export type NetworkState_v1 = NetworkState

export type NetworkState_v0 = {
  network: Network
  networks: {
    [rpcUrl: string]: Network
  }
  onboarded: boolean
}

function migrate(persistedState: unknown, version: number): NetworkStore {
  switch (version) {
    case 0: {
      const state = persistedState as NetworkState_v0
      return {
        network: state.network,
        onboarded: state.onboarded,
        networks: Object.values(state.networks),
      } as NetworkState_v1 as NetworkStore
    }
    default:
      return persistedState as NetworkStore
  }
}
