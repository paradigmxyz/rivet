import { useQuery } from '@tanstack/react-query'
import type { Client } from 'viem'

import { createQueryKey } from '~/react-query'

import { useNetworkStore } from '../zustand'
import { useClient } from './useClient'

type UseNetworkStatusParameters = {
  enabled?: boolean
  refetchInterval?: number
  retry?: number
  retryDelay?: number
  rpcUrl?: string
}

export const getNetworkStatusQueryKey = createQueryKey<
  'listening',
  [key: Client['key'], string | undefined]
>('listening')

export function useNetworkStatus({
  enabled = true,
  refetchInterval,
  retry = 5,
  retryDelay,
  rpcUrl,
}: UseNetworkStatusParameters = {}) {
  const client = useClient({ rpcUrl })
  const { networks, upsertNetwork } = useNetworkStore()

  return useQuery({
    enabled,
    queryKey: getNetworkStatusQueryKey([client.key, rpcUrl]),
    async queryFn() {
      try {
        const chainId = await client.getChainId()
        const network = networks.find((x) => x.rpcUrl === client.key)
        if (
          network &&
          chainId &&
          network.rpcUrl === client.key &&
          network.chainId !== chainId
        ) {
          upsertNetwork({ rpcUrl, network: { chainId } })
        }
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
