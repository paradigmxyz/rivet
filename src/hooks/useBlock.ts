import { queryOptions, useQuery } from '@tanstack/react-query'
import { type GetBlockParameters, stringify } from 'viem'

import { useClient } from './useClient'

export function useBlockQueryOptions(args: GetBlockParameters = {}) {
  const client = useClient()
  return queryOptions({
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

export function useBlock(args: GetBlockParameters = {}) {
  const queryOptions = useBlockQueryOptions(args)
  return useQuery(queryOptions)
}
