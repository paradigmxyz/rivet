import { useQuery } from '@tanstack/react-query'

import { usePublicClient } from './usePublicClient'
import type { Address, PublicClient } from 'viem'

export const useBalanceQueryKey = ({
  address,
  publicClient,
}: { publicClient: PublicClient; address?: Address }) => [
  'balance',
  publicClient.key,
  address,
]

export function useBalanceQueryOptions({ address }: { address?: Address }) {
  const publicClient = usePublicClient()
  return {
    enabled: Boolean(address),
    queryKey: useBalanceQueryKey({ address, publicClient }),
    async queryFn() {
      return (await publicClient.getBalance({ address: address! })) || null
    },
  }
}

export function useBalance({ address }: { address?: Address }) {
  const queryOptions = useBalanceQueryOptions({ address })
  return useQuery(queryOptions)
}
