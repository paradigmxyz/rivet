import { useQuery } from '@tanstack/react-query'

import { useNetwork } from '~/zustand'

import { usePublicClient } from './usePublicClient'

export function useNetworkStatus() {
  const { network, upsertNetwork } = useNetwork()
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: ['listening', publicClient.key],
    async queryFn() {
      try {
        const chainId = await publicClient.getChainId()
        if (network.chainId !== chainId)
          upsertNetwork({ rpcUrl: network.rpcUrl, network: { chainId } })
        return chainId
      } catch {
        return false
      }
    },
    refetchInterval: publicClient.pollingInterval,
  })
}
