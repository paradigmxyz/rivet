import { type InfiniteData, useQuery } from '@tanstack/react-query'
import type { Block, Client, Transaction } from 'viem'

import { createQueryKey, queryClient } from '~/react-query'
import { useNetworkStore } from '~/zustand'

import { getBalanceQueryKey } from './useBalance'
import { getBlockQueryKey } from './useBlock'
import { getBlockTransactionsQueryKey } from './useBlockTransactions'
import { getBlocksQueryKey } from './useBlocks'
import { useClient } from './useClient'
import { useNetworkStatus } from './useNetworkStatus'
import { getNonceQueryKey } from './useNonce'
import { getPendingTransactionsQueryKey } from './usePendingTransactions'
import { getTxpoolQueryKey } from './useTxpool'

type UsePendingBlockParameters = { refetchInterval?: number }

export const getPendingBlockQueryKey = createQueryKey<
  'pending-block',
  [key: Client['key']]
>('pending-block')

export function usePendingBlockQueryOptions({
  refetchInterval,
}: UsePendingBlockParameters = {}) {
  const { network } = useNetworkStore()
  const { data: chainId } = useNetworkStatus()
  const client = useClient()

  return {
    enabled: Boolean(chainId),
    queryKey: getPendingBlockQueryKey([client.key]),
    async queryFn() {
      const block = await client.getBlock({
        blockTag: 'pending',
      })
      const prevBlock = queryClient.getQueryData([
        'pending-block',
        client.key,
      ]) as Block

      if (
        block &&
        prevBlock &&
        prevBlock.number === block.number &&
        prevBlock.transactions.length === block.transactions.length
      )
        return prevBlock || null

      queryClient.invalidateQueries({
        queryKey: getBalanceQueryKey([client.key]),
      })
      queryClient.invalidateQueries({
        queryKey: getBlockQueryKey([client.key, 'latest']),
      })
      queryClient.invalidateQueries({
        queryKey: getNonceQueryKey([client.key]),
      })
      queryClient.invalidateQueries({
        queryKey: getPendingTransactionsQueryKey([client.key]),
      })
      queryClient.invalidateQueries({
        queryKey: getTxpoolQueryKey([client.key]),
      })

      const latestBlock = await client.getBlock({
        includeTransactions: true,
      })
      queryClient.setQueryData<InfiniteData<Block[]>>(
        getBlocksQueryKey([client.key]),
        (data) => {
          if (!data) return
          return {
            ...data,
            pages: [[latestBlock], ...data.pages],
          }
        },
      )
      queryClient.setQueryData<InfiniteData<Transaction[]>>(
        getBlockTransactionsQueryKey([client.key]),
        (data) => {
          if (!data) return
          return {
            ...data,
            pages: [[...latestBlock.transactions], ...data.pages],
          }
        },
      )

      return block || null
    },
    gcTime: 0,
    refetchInterval:
      refetchInterval ?? network.blockTime * 1_000 ?? client.pollingInterval,
  }
}

export function usePendingBlock({
  refetchInterval,
}: UsePendingBlockParameters = {}) {
  const queryOptions = usePendingBlockQueryOptions({ refetchInterval })
  return useQuery(queryOptions)
}
