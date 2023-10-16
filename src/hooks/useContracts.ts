import { useCallback, useMemo } from 'react'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { createQueryKey } from '~/react-query'
import type { Client } from '~/viem'
import { useContractsStore, useNetworkStore } from '~/zustand'
import { type ContractsActions, getContractsKey } from '~/zustand/contracts'
import { getContracts } from '../actions/getContracts'
import { useBlock } from './useBlock'
import { useClient } from './useClient'

export const getContractsQueryKey = createQueryKey<
  'contracts',
  [key: Client['key']]
>('contracts')

export function useContractsQueryOptions() {
  const { data: block } = useBlock()
  const { syncContracts } = useContractsStore()
  const { network } = useNetworkStore()
  const client = useClient()

  return queryOptions({
    staleTime: Infinity,
    enabled: Boolean(
      block?.number &&
        network.forkBlockNumber &&
        block?.number > network.forkBlockNumber,
    ),
    queryKey: getContractsQueryKey([client.key]),
    async queryFn() {
      if (!network.forkBlockNumber) throw new Error()

      const contracts = await getContracts(client, {
        fromBlock: network.forkBlockNumber + 1n,
        toBlock: 'latest',
      })
      syncContracts({ rpcUrl: network.rpcUrl }, { contracts })
      return contracts
    },
  })
}

export function useContracts() {
  const queryOptions = useContractsQueryOptions()
  const contractsStore = useContractsStore()
  const { network } = useNetworkStore()

  const contracts = useMemo(
    () =>
      contractsStore.contracts[
        getContractsKey({
          rpcUrl: network.rpcUrl,
        })
      ] ?? [],
    [network.rpcUrl, contractsStore.contracts],
  )
  const addContract = useCallback(
    (args: Parameters<ContractsActions['addContract']>[1]) =>
      contractsStore.addContract({ rpcUrl: network.rpcUrl }, args),
    [network.rpcUrl, contractsStore.addContract],
  )
  const hideContract = useCallback(
    (args: Parameters<ContractsActions['hideContract']>[1]) =>
      contractsStore.hideContract({ rpcUrl: network.rpcUrl }, args),
    [network.rpcUrl, contractsStore.hideContract],
  )
  const removeContract = useCallback(
    (args: Parameters<ContractsActions['removeContract']>[1]) =>
      contractsStore.removeContract({ rpcUrl: network.rpcUrl }, args),
    [network.rpcUrl, contractsStore.removeContract],
  )
  const updateContract = useCallback(
    (args: Parameters<ContractsActions['updateContract']>[1]) =>
      contractsStore.updateContract({ rpcUrl: network.rpcUrl }, args),
    [network.rpcUrl, contractsStore.updateContract],
  )

  return Object.assign(useQuery(queryOptions), {
    addContract,
    contracts,
    hideContract,
    removeContract,
    updateContract,
  })
}
