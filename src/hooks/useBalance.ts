import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Client, GetBalanceParameters } from 'viem'

import { createQueryKey } from '~/react-query'

import { useClient } from './useClient'

type UseBalanceParameters = {
  address?: GetBalanceParameters['address']
}

export const getBalanceQueryKey = createQueryKey<
  'balance',
  [key: Client['key'], args: UseBalanceParameters]
>('balance')

export function useBalanceQueryOptions({ address }: UseBalanceParameters) {
  const client = useClient()
  return queryOptions({
    enabled: Boolean(address),
    queryKey: getBalanceQueryKey([client.key, { address }]),
    async queryFn() {
      return (await client.getBalance({ address: address! })) || null
    },
  })
}

export function useBalance({ address }: UseBalanceParameters) {
  const queryOptions = useBalanceQueryOptions({ address })
  return useQuery(queryOptions)
}
