import { useQuery } from '@tanstack/react-query'
import { type GetBlockParameters, stringify } from 'viem'

import { usePublicClient } from './usePublicClient'

export function useBlockQueryOptions(args: GetBlockParameters = {}) {
  const publicClient = usePublicClient()
  return {
    queryKey: ['block', publicClient.key, stringify(args)],
    async queryFn() {
      return (await publicClient.getBlock(args)) || null
    },
    gcTime: 0,
  }
}

export function useBlock(args: GetBlockParameters = {}) {
  const queryOptions = useBlockQueryOptions(args)
  return useQuery(queryOptions)
}
