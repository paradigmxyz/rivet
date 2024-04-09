import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Client } from 'viem'

import { createQueryKey } from '~/react-query'

import { useClient } from './useClient'

type UseSnapshotParameters = {
  blockNumber?: bigint | null
  enabled?: boolean
}

export const getSnapshotQueryKey = createQueryKey<
  'snapshot',
  [key: Client['key'], blockNumber: string]
>('snapshot')

export function useSnapshotQueryOptions({
  blockNumber,
  enabled = true,
}: UseSnapshotParameters) {
  const client = useClient()
  return queryOptions({
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: 0,
    enabled: Boolean(enabled && blockNumber),
    queryKey: getSnapshotQueryKey([client.key, (blockNumber || '').toString()]),
    async queryFn() {
      return (await client.snapshot()) || null
    },
  })
}

export function useSnapshot({ blockNumber, enabled }: UseSnapshotParameters) {
  const queryOptions = useSnapshotQueryOptions({ blockNumber, enabled })
  return useQuery(queryOptions)
}
