import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Transaction } from 'viem'

import { useClient } from './useClient'

export function usePendingTransactionsQueryOptions() {
  const client = useClient()
  return queryOptions({
    queryKey: ['pending-transactions', client.key],
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
