import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import type { Block, Client } from 'viem'
import { createQueryKey, queryClient } from '~/react-query'

import { useBlock } from './useBlock'
import { useClient } from './useClient'

export const getInfiniteBlocksQueryKey = createQueryKey<
  'blocks',
  [key: Client['key']]
>('blocks')

export function useInfiniteBlocksQueryOptions() {
  const limit_ = 10

  const { data: block } = useBlock({ gcTime: 0 })
  const client = useClient()
  return {
    enabled: Boolean(block?.number),
    defaultPageParam: 0,
    getNextPageParam: (_: unknown, pages: unknown[]) => pages.length,
    queryKey: getInfiniteBlocksQueryKey([client.key]),
    async queryFn({ pageParam }: { pageParam: number }) {
      let blockNumber = block?.number!
      let limit = limit_

      const prevInfiniteBlocks = queryClient.getQueryData([
        'blocks',
        client.key,
      ]) as InfiniteData<Block[]>
      if (prevInfiniteBlocks) {
        if (pageParam > 0) {
          const block = prevInfiniteBlocks.pages[pageParam - 1]
          blockNumber = block[block.length - 1].number! - 1n
        } else {
          limit = prevInfiniteBlocks.pages[0].length || limit
        }
      }

      return (
        await Promise.all(
          [...Array(limit)].map(async (_, i) =>
            client.getBlock({ blockNumber: blockNumber - BigInt(i) }),
          ),
        )
      ).filter(Boolean)
    },
  }
}

export function useInfiniteBlocks() {
  const queryOptions = useInfiniteBlocksQueryOptions()
  return useInfiniteQuery(queryOptions)
}
