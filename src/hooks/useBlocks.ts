import { useInfiniteQuery } from '@tanstack/react-query'

import { useBlock } from './useBlock'
import { useClient } from './useClient'

export function useBlocksQueryOptions({ limit = 10 }: { limit?: number } = {}) {
  const { data: block } = useBlock()
  const client = useClient()
  return {
    enabled: Boolean(block?.number),
    defaultPageParam: 0,
    // TODO: fix issue where mining blocks and fetching more shows mismatch
    getNextPageParam: (_1: unknown, _2: unknown, prev: number) =>
      (prev || 0) + 1,
    queryKey: ['blocks', client.key],
    async queryFn({ pageParam }: { pageParam: number }) {
      return (
        await Promise.all(
          [...Array(limit)].map(async (_, i) => {
            if (typeof block?.number !== 'bigint') return null
            const blockNumber =
              block.number - BigInt(pageParam) * BigInt(limit) - BigInt(i)
            return client.getBlock({ blockNumber })
          }),
        )
      ).filter(Boolean)
    },
  }
}

export function useBlocks({ limit = 10 }: { limit?: number } = {}) {
  const queryOptions = useBlocksQueryOptions({ limit })
  return useInfiniteQuery(queryOptions)
}
