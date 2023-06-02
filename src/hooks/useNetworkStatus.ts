import { useQuery } from '@tanstack/react-query'

import { useNetwork } from '~/zustand'

import { usePublicClient } from './usePublicClient'

export function useNetworkStatus() {
  const { network, setNetwork } = useNetwork()
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: ['listening', publicClient.key],
    queryFn: async () => {
      try {
        const chainId = await publicClient.getChainId()
        if (network.chainId !== chainId) setNetwork({ chainId })
        return chainId
      } catch {
        return false
      }
    },
    refetchInterval: publicClient.pollingInterval,
  })
}
