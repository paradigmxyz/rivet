import { useQuery } from '@tanstack/react-query'

import { useTestClient } from './useTestClient'

export function useGetAutomineQueryOptions() {
  const testClient = useTestClient()

  return {
    queryKey: ['automining', testClient.key],
    async queryFn() {
      return testClient.getAutomine()
    },
  }
}

export function useGetAutomine() {
  const queryOptions = useGetAutomineQueryOptions()
  return useQuery(queryOptions)
}
