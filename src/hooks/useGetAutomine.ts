import { useQuery } from '@tanstack/react-query'
import type { Client } from 'viem'

import { createQueryKey } from '~/react-query'

import { useClient } from './useClient'

export const getAutomineQueryKey = createQueryKey<
  'automining',
  [key: Client['key']]
>('automining')

export function useGetAutomineQueryOptions() {
  const client = useClient()

  return {
    queryKey: getAutomineQueryKey([client.key]),
    async queryFn() {
      return client.getAutomine()
    },
  }
}

export function useGetAutomine() {
  const queryOptions = useGetAutomineQueryOptions()
  return useQuery(queryOptions)
}
