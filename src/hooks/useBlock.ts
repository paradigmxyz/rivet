import { queryOptions, useQuery } from '@tanstack/react-query'
import { type BlockTag, type GetBlockParameters, stringify } from 'viem'

import { createQueryKey } from '~/react-query'
import type { Client } from '~/viem'

import { useClient } from './useClient'

export type UseBlockParameters<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = 'latest',
> = GetBlockParameters<TIncludeTransactions, TBlockTag> & {
  gcTime?: number
}

export const getBlockQueryKey = createQueryKey<
  'block',
  [key: Client['key'], block: BlockTag | (string & {}), deps: string]
>('block')

export function getBlockQueryOptions<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = 'latest',
>(
  client: Client,
  args: UseBlockParameters<TIncludeTransactions, TBlockTag> = {},
) {
  return queryOptions({
    gcTime: args.gcTime,
    queryKey: getBlockQueryKey([
      client.key,
      args.blockHash ||
        args.blockNumber?.toString() ||
        args.blockTag ||
        'latest',
      stringify(args),
    ]),
    async queryFn() {
      return (await client.getBlock(args)) || null
    },
  })
}

export function useBlockQueryOptions<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = 'latest',
>(args: UseBlockParameters<TIncludeTransactions, TBlockTag> = {}) {
  const client = useClient()
  return getBlockQueryOptions(client, args)
}

export function useBlock<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = 'latest',
>(args: UseBlockParameters<TIncludeTransactions, TBlockTag> = {}) {
  const queryOptions = useBlockQueryOptions(args)
  return useQuery(queryOptions)
}
