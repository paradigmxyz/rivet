import { useQuery } from '@tanstack/react-query'

import { useNetworkStatus } from './useNetworkStatus'
import { usePublicClient } from './usePublicClient'

export function useBlockNumberQueryOptions() {
  const { data: chainId } = useNetworkStatus()
  const publicClient = usePublicClient()
  return {
    enabled: Boolean(chainId),
    queryKey: ['blockNumber', publicClient.key],
    async queryFn() {
      return (await publicClient.getBlockNumber({ maxAge: 0 })) || null
    },
    gcTime: 0,
    // TODO: configure based on interval mining config.
    refetchInterval: 1_000,
  }
}

export function useBlockNumber() {
  const queryOptions = useBlockNumberQueryOptions()
  return useQuery(queryOptions)
}
