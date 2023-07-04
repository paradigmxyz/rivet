import { useQuery } from '@tanstack/react-query'
import type { Address, PublicClient } from 'viem'

import { usePublicClient } from './usePublicClient'

export const useNonceQueryKey = ({
  address,
  publicClient,
}: { publicClient: PublicClient; address?: Address }) => [
  'nonce',
  publicClient.key,
  address,
]

export function useNonceQueryOptions({ address }: { address?: Address }) {
  const publicClient = usePublicClient()
  return {
    enabled: Boolean(address),
    queryKey: useNonceQueryKey({ address, publicClient }),
    async queryFn() {
      return (
        (await publicClient.getTransactionCount({ address: address! })) ?? 0
      )
    },
  }
}

export function useNonce({ address }: { address?: Address }) {
  const queryOptions = useNonceQueryOptions({ address })
  return useQuery(queryOptions)
}
