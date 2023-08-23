import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Client, Transaction } from 'viem'

import { createQueryKey } from '~/react-query'

import { useClient } from './useClient'

export const getPendingTransactionsQueryKey = createQueryKey<
  'pending-transactions',
  [key: Client['key']]
>('pending-transactions')

export function usePendingTransactionsQueryOptions() {
  const client = useClient()
  return queryOptions({
    queryKey: getPendingTransactionsQueryKey([client.key]),
    async queryFn() {
      const block = await client.getBlock({
        blockTag: 'pending',
        includeTransactions: true,
      })
      return [...(block.transactions as Transaction[])].reverse()
    },
  })
}

export function usePendingTransactions() {
  const queryOptions = usePendingTransactionsQueryOptions()
  return useQuery(queryOptions)
}
