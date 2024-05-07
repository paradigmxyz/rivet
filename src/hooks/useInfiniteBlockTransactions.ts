import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import type { Client, Transaction } from 'viem'

import { createQueryKey, queryClient } from '~/react-query'

import { useBlock } from './useBlock'
import { useClient } from './useClient'

export const getInfiniteBlockTransactionsQueryKey = createQueryKey<
  'block-transactions',
  [key: Client['key']]
>('block-transactions')

export function useInfiniteBlockTransactionsQueryOptions() {
  const { data: block } = useBlock({ gcTime: 0 })
  const client = useClient()
  const limit_ = 10

  return {
    enabled: Boolean(block?.number),
    initialPageParam: 0,
    getNextPageParam: (lastPage: unknown[], pages: unknown[]) => {
      if (lastPage.length < limit_) return null
      return pages.length
    },
    queryKey: getInfiniteBlockTransactionsQueryKey([client.key]),
    async queryFn({ pageParam }: { pageParam: number }) {
      let blockNumber = block?.number!
      let limit = limit_

      const prevInfiniteTransactions = queryClient.getQueryData([
        'block-transactions',
        client.key,
      ]) as InfiniteData<Transaction[]>
      if (prevInfiniteTransactions) {
        if (pageParam > 0) {
          const transactions = prevInfiniteTransactions.pages[pageParam - 1]
          blockNumber = transactions[transactions.length - 1].blockNumber! - 1n
        } else {
          limit = prevInfiniteTransactions.pages[0].length || limit
        }
      }

      let count = 0
      let transactions: Transaction[] = []
      while (transactions.length < limit && count < 10 && blockNumber > 0n) {
        const block_ = await client.getBlock({
          blockNumber,
          includeTransactions: true,
        })
        transactions = [...transactions, ...block_.transactions]
        blockNumber--
        count++
      }
      return transactions
    },
  }
}

export function useInfiniteBlockTransactions() {
  const queryOptions = useInfiniteBlockTransactionsQueryOptions()
  return useInfiniteQuery(queryOptions)
}
