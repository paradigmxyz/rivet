import { useInfiniteQuery } from '@tanstack/react-query'

import { useClient } from './useClient'
import { useCurrentBlock } from './useCurrentBlock'

export function useBlocksQueryOptions({ limit = 10 }: { limit?: number } = {}) {
  const { data: block } = useCurrentBlock({ refetchInterval: 0 })
  const client = useClient()
  return {
    enabled: Boolean(block?.number),
    defaultPageParam: 0,
    // TODO: fix issue where mining blocks and fetching more shows mismatch
    getNextPageParam: (_1: unknown, _2: unknown, prev: number) => prev + 1,
    queryKey: ['blocks', client.key],
    async queryFn({ pageParam }: { pageParam: number }) {
      return Promise.all(
        [...Array(limit)].map(async (_, i) => {
          const blockNumber =
            block?.number! - BigInt(pageParam) * BigInt(limit) - BigInt(i)
          return client.getBlock({ blockNumber })
        }),
      )
    },
  }
}

export function useBlocks({ limit = 10 }: { limit?: number } = {}) {
  const queryOptions = useBlocksQueryOptions({ limit })
  return useInfiniteQuery(queryOptions)
}
