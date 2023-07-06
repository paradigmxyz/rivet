import { useQuery } from '@tanstack/react-query'
import type { Block } from 'viem'

import { queryClient } from '~/react-query'
import { useNetworkStore } from '~/zustand'

import { useBlockQueryOptions } from './useBlock'
import { useNetworkStatus } from './useNetworkStatus'
import { usePendingTransactionsQueryOptions } from './usePendingTransactions'
import { usePublicClient } from './usePublicClient'

export function useCurrentBlockQueryOptions({
  refetchInterval,
}: { refetchInterval?: number } = {}) {
  const pendingBlockQueryOptions = useBlockQueryOptions({ blockTag: 'pending' })
  const pendingTransactionsQueryOptions = usePendingTransactionsQueryOptions()
  const { network } = useNetworkStore()
  const { data: chainId } = useNetworkStatus()
  const publicClient = usePublicClient()

  return {
    enabled: Boolean(chainId),
    queryKey: ['current-block', publicClient.key],
    async queryFn() {
      const blockNumber = await publicClient.getBlockNumber({ maxAge: 0 })
      const prevBlock = queryClient.getQueryData([
        'current-block',
        publicClient.key,
      ]) as Block

      if (blockNumber && prevBlock && prevBlock.number === blockNumber)
        return prevBlock || null

      queryClient.invalidateQueries({ queryKey: ['balance'] })
      queryClient.invalidateQueries({ queryKey: ['nonce'] })
      queryClient.invalidateQueries({ queryKey: ['txpool'] })
      queryClient.invalidateQueries(pendingBlockQueryOptions)
      queryClient.invalidateQueries(pendingTransactionsQueryOptions)

      const block = await publicClient.getBlock({
        blockNumber,
        includeTransactions: true,
      })

      queryClient.setQueryData(['blocks', publicClient.key], (data: any) => {
        if (data?.pages?.[0]) data.pages[0].unshift(block)
        return data
      })
      queryClient.setQueryData(
        ['transactions', publicClient.key],
        (data: any) => {
          if (data?.pages?.[0]) data.pages[0].unshift(...block.transactions)
          return data
        },
      )

      return block || null
    },
    gcTime: 0,
    refetchInterval: refetchInterval ?? (network.blockTime * 1_000 || 4_000),
  }
}

export function useCurrentBlock({
  refetchInterval,
}: { refetchInterval?: number } = {}) {
  const queryOptions = useCurrentBlockQueryOptions({ refetchInterval })
  return useQuery(queryOptions)
}
