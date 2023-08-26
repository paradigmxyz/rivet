import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  type BlockTag,
  type Client,
  type GetBlockParameters,
  stringify,
} from 'viem'

import { createQueryKey } from '~/react-query'

import { useClient } from './useClient'

type UseBlockParameters<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = 'latest',
> = GetBlockParameters<TIncludeTransactions, TBlockTag> & {
  gcTime?: number
}

export const getBlockQueryKey = createQueryKey<
  'block',
  [key: Client['key'], block: BlockTag | (string & {}), deps: string]
>('block')

export function useBlockQueryOptions<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = 'latest',
>(args: UseBlockParameters<TIncludeTransactions, TBlockTag> = {}) {
  const client = useClient()
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

export function useBlock<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = 'latest',
>(args: UseBlockParameters<TIncludeTransactions, TBlockTag> = {}) {
  const queryOptions = useBlockQueryOptions(args)
  return useQuery(queryOptions)
}
