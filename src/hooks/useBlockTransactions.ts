import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import type { Transaction } from 'viem'

import { queryClient } from '~/react-query'

import { useBlock } from './useBlock'
import { useClient } from './useClient'

export function useBlockTransactionsQueryOptions() {
  const { data: block } = useBlock({ gcTime: 0 })
  const client = useClient()
  const limit = 10

  return {
    enabled: Boolean(block?.number),
    defaultPageParam: 0,
    getNextPageParam: (_1: unknown, _2: unknown, prev: number) => prev + 1,
    queryKey: ['transactions', client.key],
    async queryFn({ pageParam }: { pageParam: number }) {
      let blockNumber = block?.number!
      if (pageParam > 0) {
        const prevInfiniteTransactions = queryClient.getQueryData([
          'transactions',
          client.key,
        ]) as InfiniteData<Transaction[]>
        const transactions = prevInfiniteTransactions.pages[pageParam - 1]
        blockNumber = transactions[transactions.length - 1].blockNumber! - 1n
      }

      let transactions: Transaction[] = []
      while (transactions.length < limit && blockNumber > 0n) {
        const block_ = await client.getBlock({
          blockNumber,
          includeTransactions: true,
        })
        transactions = [...transactions, ...block_.transactions]
        blockNumber--
      }
      return transactions
    },
  }
}

export function useBlockTransactions() {
  const queryOptions = useBlockTransactionsQueryOptions()
  return useInfiniteQuery(queryOptions)
}
