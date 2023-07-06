import { useQuery } from '@tanstack/react-query'

import { useNetworkStore } from '~/zustand'

import { useClient } from './useClient'

export function useNetworkStatus({
  enabled = true,
  refetchInterval = 4_000,
  retry = 5,
  retryDelay,
}: {
  enabled?: boolean
  refetchInterval?: number
  retry?: number
  retryDelay?: number
} = {}) {
  const { network, upsertNetwork } = useNetworkStore()
  const client = useClient()

  return useQuery({
    enabled,
    queryKey: ['listening', client.key],
    async queryFn() {
      try {
        const chainId = await client.getChainId()
        if (network.chainId !== chainId)
          upsertNetwork({ rpcUrl: network.rpcUrl, network: { chainId } })
        return chainId
      } catch {
        return false
      }
    },
    refetchInterval,
    retry,
    retryDelay,
  })
}
