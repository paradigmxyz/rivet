import { queryOptions, useQuery } from '@tanstack/react-query'
import { type BlockTag, type GetBlockParameters, stringify } from 'viem'

import { useClient } from './useClient'

export function useBlockQueryOptions<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = 'latest',
>(
  args: GetBlockParameters<TIncludeTransactions, TBlockTag> & {
    gcTime?: number
  } = {},
) {
  const client = useClient()
  return queryOptions({
    gcTime: args.gcTime,
    queryKey: [
      'block',
      args.blockHash ||
        args.blockNumber?.toString() ||
        args.blockTag ||
        'latest',
      client.key,
      stringify(args),
    ],
    async queryFn() {
      return (await client.getBlock(args)) || null
    },
  })
}

export function useBlock<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = 'latest',
>(
  args: GetBlockParameters<TIncludeTransactions, TBlockTag> & {
    gcTime?: number
  } = {},
) {
  const queryOptions = useBlockQueryOptions(args)
  return useQuery(queryOptions)
}
