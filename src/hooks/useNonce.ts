import { useQuery } from '@tanstack/react-query'

import { usePublicClient } from './usePublicClient'
import type { Address } from 'viem'

export function useNonceQueryOptions({ address }: { address?: Address }) {
  const publicClient = usePublicClient()
  return {
    enabled: Boolean(address),
    queryKey: ['nonce', publicClient.key, address],
    async queryFn() {
      return (
        (await publicClient.getTransactionCount({ address: address! })) || null
      )
    },
  }
}

export function useNonce({ address }: { address?: Address }) {
  const queryOptions = useNonceQueryOptions({ address })
  return useQuery(queryOptions)
}
