import { useQuery } from '@tanstack/react-query'

import { useNetworkStatus } from './useNetworkStatus'
import { usePublicClient } from './usePublicClient'

export function useBlockNumber() {
  const publicClient = usePublicClient()
  const { data: chainId } = useNetworkStatus()

  return useQuery({
    enabled: Boolean(chainId),
    queryKey: ['blockNumber', publicClient.key],
    async queryFn() {
      return (await publicClient.getBlockNumber({ maxAge: 0 })) || null
    },
    gcTime: 0,
    // TODO: configure based on interval mining config.
    refetchInterval: 1_000,
  })
}
