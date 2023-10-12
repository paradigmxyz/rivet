import { queryOptions, useQuery } from '@tanstack/react-query'
import type { GetBytecodeParameters } from 'viem'

import { createQueryKey } from '~/react-query'
import type { Client } from '~/viem'

import { useClient } from './useClient'

type UseBytecodeParameters = Partial<GetBytecodeParameters>

export const getBytecodeQueryKey = createQueryKey<
  'bytecode',
  [key: Client['key'], args: UseBytecodeParameters]
>('bytecode')

export function getBytecodeQueryOptions(
  client: Client,
  { address }: UseBytecodeParameters,
) {
  return queryOptions({
    enabled: Boolean(address),
    queryKey: getBytecodeQueryKey([client.key, { address }]),
    async queryFn() {
      return (await client.getBytecode({ address: address! })) || null
    },
  })
}

export function useBytecodeQueryOptions(args: UseBytecodeParameters) {
  const client = useClient()
  return getBytecodeQueryOptions(client, args)
}

export function useBytecode(args: UseBytecodeParameters) {
  const queryOptions = useBytecodeQueryOptions(args)
  return useQuery(queryOptions)
}
