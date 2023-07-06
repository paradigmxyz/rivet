import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

import { useClient } from './useClient'
import type { Client } from '~/viem'

export const useNonceQueryKey = ({
  address,
  client,
}: { client: Client; address?: Address }) => ['nonce', client.key, address]

export function useNonceQueryOptions({ address }: { address?: Address }) {
  const client = useClient()
  return {
    enabled: Boolean(address),
    queryKey: useNonceQueryKey({ address, client }),
    async queryFn() {
      return (await client.getTransactionCount({ address: address! })) ?? 0
    },
  }
}

export function useNonce({ address }: { address?: Address }) {
  const queryOptions = useNonceQueryOptions({ address })
  return useQuery(queryOptions)
}
