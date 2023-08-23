import { useQuery } from '@tanstack/react-query'
import type { Client } from 'viem'

import { createQueryKey } from '~/react-query'
import { useNetworkStore } from '~/zustand'

import { useClient } from './useClient'

type UseNetworkStatusParameters = {
  enabled?: boolean
  refetchInterval?: number
  retry?: number
  retryDelay?: number
}

export const getNetworkStatusQueryKey = createQueryKey<
  'listening',
  [key: Client['key']]
>('listening')

export function useNetworkStatus({
  enabled = true,
  refetchInterval,
  retry = 5,
  retryDelay,
}: UseNetworkStatusParameters = {}) {
  const { network, upsertNetwork } = useNetworkStore()
  const client = useClient()

  return useQuery({
    enabled,
    queryKey: getNetworkStatusQueryKey([client.key]),
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
    refetchInterval: refetchInterval ?? client.pollingInterval,
    retry,
    retryDelay,
  })
}
