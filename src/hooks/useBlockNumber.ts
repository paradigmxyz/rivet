import { useQuery } from '@tanstack/react-query'

import { usePublicClient } from './usePublicClient'

export function useBlockNumber({ watch }: { watch?: boolean } = {}) {
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: ['blockNumber', publicClient.key],
    queryFn: async () => {
      return await publicClient.getBlockNumber({ maxAge: 0 })
    },
    refetchInterval: watch ? 1_000 : false,
  })
}
