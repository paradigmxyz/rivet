import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Transaction } from 'viem'

import { usePublicClient } from './usePublicClient'

export function usePendingTransactionsQueryOptions() {
  const publicClient = usePublicClient()
  return queryOptions({
    queryKey: ['pending-transactions', publicClient.key],
    async queryFn() {
      const block = await publicClient.getBlock({
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
