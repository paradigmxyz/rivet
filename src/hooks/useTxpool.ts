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
      return {
        pending: Object.entries(
          mapValues(data.pending, (x) => Object.values(x).reverse()),
        ),
        queued: Object.entries(
          mapValues(data.queued, (x) => Object.values(x).reverse()),
        ),
      }
    },
  })
}

export function useTxpool() {
  const queryOptions = useTxpoolQueryOptions()
  return useQuery(queryOptions)
}
