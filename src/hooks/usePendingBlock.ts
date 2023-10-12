import { type InfiniteData, useQuery } from '@tanstack/react-query'
import { type Block, type Client, type Transaction } from 'viem'

import {
  createQueryKey,
  queryClient,
  updateInfiniteQueryData,
} from '~/react-query'
import { useNetworkStore } from '~/zustand'

import { getAccountTokensQueryKey } from './useAccountTokens'
import { getBalanceQueryKey } from './useBalance'
import { getBlockQueryKey } from './useBlock'
import { useClient } from './useClient'
import { getContractsQueryKey } from './useContracts'
import { getErc20BalanceQueryKey } from './useErc20Balance'
import { getInfiniteBlockTransactionsQueryKey } from './useInfiniteBlockTransactions'
import { getInfiniteBlocksQueryKey } from './useInfiniteBlocks'
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
        queryKey: getAccountTokensQueryKey([client.key]),
      })
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryKey([client.key]),
      })
      queryClient.invalidateQueries({
        queryKey: getContractsQueryKey([client.key]),
      })
      queryClient.invalidateQueries({
        queryKey: getErc20BalanceQueryKey([client.key]),
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
        getInfiniteBlocksQueryKey([client.key]),
        updateInfiniteQueryData<Block[]>([latestBlock]),
      )
      queryClient.setQueryData<InfiniteData<Transaction[]>>(
        getInfiniteBlockTransactionsQueryKey([client.key]),
        updateInfiniteQueryData<Transaction[]>([...latestBlock.transactions]),
      )

      return block || null
    },
    gcTime: 0,
    refetchInterval:
      refetchInterval ?? (network.blockTime * 1_000 || client.pollingInterval),
  }
}

export function usePendingBlock({
  refetchInterval,
}: UsePendingBlockParameters = {}) {
  const queryOptions = usePendingBlockQueryOptions({ refetchInterval })
  return useQuery(queryOptions)
}
