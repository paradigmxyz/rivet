import { useQuery } from '@tanstack/react-query'

import { usePublicClient } from './usePublicClient'
import type { Address } from 'viem'

export function useBalanceQueryOptions({ address }: { address?: Address }) {
  const publicClient = usePublicClient()
  return {
    enabled: Boolean(address),
    queryKey: ['balance', publicClient.key, address],
    async queryFn() {
      return (await publicClient.getBalance({ address: address! })) || null
    },
  }
}

export function useBalance({ address }: { address?: Address }) {
  const queryOptions = useBalanceQueryOptions({ address })
  return useQuery(queryOptions)
}
