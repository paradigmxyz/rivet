import type { Abi, Address } from 'abitype'
import type { Hex, TransactionReceipt } from 'viem'
import { useStore } from 'zustand'

import type { RequiredBy } from '~/utils/types'
import { createStore, getKey } from './utils'

type Contract = {
  abi?: Abi
  address: Address
  bytecode?: Hex | null
  key: string
  receipt?: TransactionReceipt
  state: 'loaded' | 'loading'
  visible: boolean
}

type ContractsKey = {
  rpcUrl: string
}
type SerializedContractsKey = string

export type ContractsState = {
  contracts: Record<string, Contract[] | undefined>
}
export type ContractsActions = {
  addContract: (
    key: ContractsKey,
    args: RequiredBy<Partial<Contract>, 'address'>,
  ) => void
  updateContract: (
    key: ContractsKey,
    args: RequiredBy<Partial<Contract>, 'address'>,
  ) => void
  hideContract: (
    key: ContractsKey,
    args: {
      address: Contract['address']
    },
  ) => void
  removeContract: (
    key: ContractsKey,
    args:
      | {
          address: Contract['address']
          key?: undefined
        }
      | {
          address?: undefined
          key: Contract['key']
        },
  ) => void
  syncContracts: (
    key: ContractsKey,
    parameters: {
      contracts: RequiredBy<Partial<Contract>, 'address'>[]
    },
  ) => void
}
export type ContractsStore = ContractsState & ContractsActions

export function getContractsKey(key: ContractsKey): SerializedContractsKey {
  return getKey(Object.values(key))
}

export const contractsStore = createStore<ContractsStore>(
  (set) => ({
    contracts: {},
    addContract(key, contract) {
      const serializedKey = getContractsKey(key)

      set((state) => {
        const contracts = { ...state.contracts }

        const contract_ = {
          key: `${contract.address}-${contract.bytecode}`,
          state: 'loaded',
          visible: true,
          ...contract,
        } satisfies Contract

        contracts[serializedKey] = [
          contract_,
          ...(contracts[serializedKey] || []),
        ]

        return {
          ...state,
          contracts,
        }
      })
    },
    updateContract(key, contract) {
      const serializedKey = getContractsKey(key)

      set((state) => {
        const contracts = { ...state.contracts }
        const index = contracts[serializedKey]?.findIndex(
          (c) => c.address === contract.address || c.key === contract.key,
        )

        if (typeof index === 'number' && index >= 0)
          (contracts as any)[serializedKey][index] = {
            ...contracts[serializedKey]?.[index],
            ...contract,
            key: `${contract.address}-${contract.bytecode}`,
          }

        return {
          ...state,
          contracts,
        }
      })
    },
    hideContract(key, { address }) {
      const serializedKey = getContractsKey(key)

      set((state) => {
        const contracts = { ...state.contracts }
        contracts[serializedKey] = (state.contracts[serializedKey] || []).map(
          (token) => {
            if (token.address === address)
              return {
                ...token,
                visible: false,
              }
            return token
          },
        )
        return {
          ...state,
          contracts,
        }
      })
    },
    removeContract(key, { address, key: key_ }) {
      const serializedKey = getContractsKey(key)

      set((state) => {
        const contracts = { ...state.contracts }
        contracts[serializedKey] = contracts[serializedKey]?.filter(
          (contract) => {
            if (address && contract.address !== address) return true
            if (key_ && contract.key !== key_) return true
            return false
          },
        )
        return {
          ...state,
          contracts,
        }
      })
    },
    syncContracts(key, args) {
      const { contracts: contracts_ } = args
      const serializedKey = getContractsKey(key)

      set((state) => {
        const contracts = { ...state.contracts }

        for (const contract of contracts_) {
          const exists = (contracts[serializedKey] || []).some(
            (x) => x.address === contract.address,
          )
          if (!exists)
            contracts[serializedKey] = [
              {
                ...contract,
                key: contract.address,
                state: 'loaded',
                visible: true,
              },
              ...(contracts[serializedKey] || []),
            ]
        }

        contracts[serializedKey] = contracts[serializedKey]?.filter(
          (c) => c.address !== '0x',
        )

        return {
          ...state,
          contracts,
        }
      })
    },
  }),
  {
    persist: {
      name: 'contracts',
      version: 0,
    },
  },
)

export const useContractsStore = () => useStore(contractsStore)
