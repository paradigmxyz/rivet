import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

import type { Client } from '~/viem'

import { useClient } from './useClient'

export const getBalanceQueryKey = ({
  address,
  client,
}: { client: Client; address?: Address }) => ['balance', client.key, address]

export function useBalanceQueryOptions({ address }: { address?: Address }) {
  const client = useClient()
  return {
    enabled: Boolean(address),
    queryKey: getBalanceQueryKey({ address, client }),
    async queryFn() {
      return (await client.getBalance({ address: address! })) || null
    },
  }
}

export function useBalance({ address }: { address?: Address }) {
  const queryOptions = useBalanceQueryOptions({ address })
  return useQuery(queryOptions)
}
