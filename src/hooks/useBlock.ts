import { queryOptions, useQuery } from '@tanstack/react-query'
import { type GetBlockParameters, stringify } from 'viem'

import { usePublicClient } from './usePublicClient'

export function useBlockQueryOptions(args: GetBlockParameters = {}) {
  const publicClient = usePublicClient()
  return queryOptions({
    queryKey: [
      'block',
      args.blockHash || args.blockNumber || args.blockTag || 'latest',
      publicClient.key,
      stringify(args),
    ],
    async queryFn() {
      return (await publicClient.getBlock(args)) || null
    },
  })
}

export function useBlock(args: GetBlockParameters = {}) {
  const queryOptions = useBlockQueryOptions(args)
  return useQuery(queryOptions)
}
