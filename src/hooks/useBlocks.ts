import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import type { Block } from 'viem'
import { queryClient } from '~/react-query'

import { useBlock } from './useBlock'
import { useClient } from './useClient'

export function useBlocksQueryOptions({ limit = 10 }: { limit?: number } = {}) {
  const { data: block } = useBlock({ gcTime: 0 })
  const client = useClient()
  return {
    enabled: Boolean(block?.number),
    defaultPageParam: 0,
    getNextPageParam: (_: unknown, pages: unknown[]) => pages.length,
    queryKey: ['blocks', client.key],
    async queryFn({ pageParam }: { pageParam: number }) {
      let blockNumber = block?.number!
      if (pageParam > 0) {
        const prevInfiniteBlocks = queryClient.getQueryData([
          'blocks',
          client.key,
        ]) as InfiniteData<Block[]>
        const block = prevInfiniteBlocks.pages[pageParam - 1]
        blockNumber = block[block.length - 1].number! - 1n
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

export function useBlocks({ limit = 10 }: { limit?: number } = {}) {
  const queryOptions = useBlocksQueryOptions({ limit })
  return useInfiniteQuery(queryOptions)
}
