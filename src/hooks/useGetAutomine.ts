import { useQuery } from '@tanstack/react-query'

import { useClient } from './useClient'

export function useGetAutomineQueryOptions() {
  const client = useClient()

  return {
    queryKey: ['automining', client.key],
    async queryFn() {
      return client.getAutomine()
    },
  }
}

export function useGetAutomine() {
  const queryOptions = useGetAutomineQueryOptions()
  return useQuery(queryOptions)
}
