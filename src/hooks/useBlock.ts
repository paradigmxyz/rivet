import { useQuery } from '@tanstack/react-query'

import { useNetwork } from '~/zustand'

import { useNetworkStatus } from './useNetworkStatus'
import { usePublicClient } from './usePublicClient'

export function useBlockQueryOptions() {
  const { network } = useNetwork()
  const { data: chainId } = useNetworkStatus()
  const publicClient = usePublicClient()
  return {
    enabled: Boolean(chainId),
    queryKey: ['block', publicClient.key],
    async queryFn() {
      const blockNumber = await publicClient.getBlockNumber({ maxAge: 0 })
      return (await publicClient.getBlock({ blockNumber })) || null
    },
    gcTime: 0,
    refetchInterval: network.blockTime * 1_000 || 4_000,
  }
}

export function useBlock() {
  const queryOptions = useBlockQueryOptions()
  return useQuery(queryOptions)
}
