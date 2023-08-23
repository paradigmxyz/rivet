import { useQuery } from '@tanstack/react-query'
import type { Client, GetTransactionCountParameters } from 'viem'

import { createQueryKey } from '~/react-query'

import { useClient } from './useClient'

type UseNonceParameters = {
  address?: GetTransactionCountParameters['address']
}

export const getNonceQueryKey = createQueryKey<
  'nonce',
  [key: Client['key'], deps: UseNonceParameters]
>('nonce')

export function useNonceQueryOptions({ address }: UseNonceParameters) {
  const client = useClient()
  return {
    enabled: Boolean(address),
    queryKey: getNonceQueryKey([client.key, { address }]),
    async queryFn() {
      return (await client.getTransactionCount({ address: address! })) ?? 0
    },
  }
}

export function useNonce({ address }: UseNonceParameters) {
  const queryOptions = useNonceQueryOptions({ address })
  return useQuery(queryOptions)
}
