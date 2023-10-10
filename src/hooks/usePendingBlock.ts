import { type InfiniteData, useQuery } from '@tanstack/react-query'
import { type Block, type Client, type Transaction, parseAbiItem } from 'viem'

import {
  createQueryKey,
  queryClient,
  updateInfiniteQueryData,
} from '~/react-query'
import { useAccountStore, useNetworkStore, useTokensStore } from '~/zustand'

import { getBalanceQueryKey } from './useBalance'
import { getBlockQueryKey } from './useBlock'
import { useClient } from './useClient'
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
  const { addToken } = useTokensStore()
  const { account } = useAccountStore()
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

      // Import any tokens from Transfer event
      if (account && prevBlock.number) {
        const transfersFrom = await client.getLogs({
          event: parseAbiItem(
            'event Transfer(address indexed from, address indexed to, uint256)',
          ),
          args: {
            from: account.address,
          },
          fromBlock: prevBlock.number,
          toBlock: 'latest',
        })
        const transfersTo = await client.getLogs({
          event: parseAbiItem(
            'event Transfer(address indexed from, address indexed to, uint256)',
          ),
          args: {
            to: account.address,
          },
          fromBlock: prevBlock.number,
          toBlock: 'latest',
        })
        ;[
          ...new Set([
            ...(transfersFrom?.map((t) => t.address) || []),
            ...(transfersTo?.map((t) => t.address) || []),
          ]),
        ].forEach((addr) => {
          console.log(addr)
          addToken(addr, account.address)
        })
      }

      queryClient.invalidateQueries({
        queryKey: getBalanceQueryKey([client.key]),
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
      refetchInterval ?? network.blockTime * 1_000 ?? client.pollingInterval,
  }
}

export function usePendingBlock({
  refetchInterval,
}: UsePendingBlockParameters = {}) {
  const queryOptions = usePendingBlockQueryOptions({ refetchInterval })
  return useQuery(queryOptions)
}
