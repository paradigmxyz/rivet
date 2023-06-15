import { useQuery } from '@tanstack/react-query'

import { useNetwork } from '~/zustand'

import { useNetworkStatus } from './useNetworkStatus'
import { usePublicClient } from './usePublicClient'

export function useBlockNumberQueryOptions() {
  const { network } = useNetwork()
  const { data: chainId } = useNetworkStatus()
  const publicClient = usePublicClient()
  return {
    enabled: Boolean(chainId),
    queryKey: ['blockNumber', publicClient.key],
    async queryFn() {
      return (await publicClient.getBlockNumber({ maxAge: 0 })) || null
    },
    gcTime: 0,
    refetchInterval: network.blockTime * 1_000 || 4_000,
  }
}

export function useBlockNumber() {
  const queryOptions = useBlockNumberQueryOptions()
  return useQuery(queryOptions)
}
