import { useQuery } from '@tanstack/react-query'
import type { Block } from 'viem'

import { queryClient } from '~/react-query'
import { useNetworkStore } from '~/zustand'

import { useClient } from './useClient'
import { useNetworkStatus } from './useNetworkStatus'
import { usePendingTransactionsQueryOptions } from './usePendingTransactions'

export function usePendingBlockQueryOptions({
  refetchInterval,
}: { refetchInterval?: number } = {}) {
  const pendingTransactionsQueryOptions = usePendingTransactionsQueryOptions()
  const { network } = useNetworkStore()
  const { data: chainId } = useNetworkStatus()
  const client = useClient()

  return {
    enabled: Boolean(chainId),
    queryKey: ['pending-block', client.key],
    async queryFn() {
      const block = await client.getBlock({
        blockTag: 'pending',
      })
      const prevBlock = queryClient.getQueryData([
        'pending-block',
        client.key,
      ]) as Block

      if (block && prevBlock && prevBlock.number === block.number)
        return prevBlock || null

      queryClient.invalidateQueries({ queryKey: ['balance'] })
      queryClient.invalidateQueries({ queryKey: ['block', 'latest'] })
      queryClient.invalidateQueries({ queryKey: ['nonce'] })
      queryClient.invalidateQueries({ queryKey: ['txpool'] })
      queryClient.invalidateQueries(pendingTransactionsQueryOptions)

      const latestBlock = await client.getBlock({
        includeTransactions: true,
      })
      queryClient.setQueryData(['blocks', client.key], (data: any) => {
        if (data?.pages?.[0]) data.pages[0].unshift(latestBlock)
        return data
      })
      queryClient.setQueryData(['transactions', client.key], (data: any) => {
        const [first, ...pages] = data.pages
        return {
          ...data,
          pages: [[...latestBlock.transactions, ...first], ...pages],
        }
      })

      return block || null
    },
    gcTime: 0,
    refetchInterval: refetchInterval ?? (network.blockTime * 1_000 || 4_000),
  }
}

export function usePendingBlock({
  refetchInterval,
}: { refetchInterval?: number } = {}) {
  const queryOptions = usePendingBlockQueryOptions({ refetchInterval })
  return useQuery(queryOptions)
}
