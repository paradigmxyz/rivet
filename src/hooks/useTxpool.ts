import { deepmerge } from '@fastify/deepmerge'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { mapValues } from 'remeda'

import { useNetworkStatus } from './useNetworkStatus'
import { useTestClient } from './useTestClient'

export function useTxpoolQueryOptions() {
  const { data: chainId } = useNetworkStatus()
  const testClient = useTestClient()
  return queryOptions({
    enabled: Boolean(chainId),
    queryKey: ['txpool', testClient.key],
    async queryFn() {
      return (await testClient.getTxpoolContent()) || null
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
