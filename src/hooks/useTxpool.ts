import { deepmerge } from '@fastify/deepmerge'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { mapValues } from 'remeda'
import type { Client } from 'viem'

import { createQueryKey } from '~/react-query'

import { useClient } from './useClient'
import { useNetworkStatus } from './useNetworkStatus'

export const getTxpoolQueryKey = createQueryKey<'txpool', [key: Client['key']]>(
  'txpool',
)

export function useTxpoolQueryOptions() {
  const { data: chainId } = useNetworkStatus()
  const client = useClient()
  return queryOptions({
    enabled: Boolean(chainId),
    queryKey: getTxpoolQueryKey([client.key]),
    async queryFn() {
      return (await client.getTxpoolContent()) || null
    },
    select(data) {
      const pending = mapValues(data.pending, (x) =>
        Object.values(x)
          .reverse()
          .map(
            (transaction) =>
              ({
                transaction,
                type: 'pending',
              }) as const,
          ),
      )
      const queued = mapValues(data.queued, (x) =>
        Object.values(x)
          .reverse()
          .map(
            (transaction) =>
              ({
                transaction,
                type: 'queued',
              }) as const,
          ),
      )
      return Object.entries(deepmerge()(pending, queued))
    },
  })
}

export function useTxpool() {
  const queryOptions = useTxpoolQueryOptions()
  return useQuery(queryOptions)
}
