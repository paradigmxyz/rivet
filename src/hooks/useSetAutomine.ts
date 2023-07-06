import { useMutation } from '@tanstack/react-query'

import { queryClient } from '~/react-query'
import { useNetworkStore } from '~/zustand'

import { useClient } from './useClient'
import { useGetAutomineQueryOptions } from './useGetAutomine'

export function useSetAutomine() {
  const { queryKey } = useGetAutomineQueryOptions()
  const { network, upsertNetwork } = useNetworkStore()
  const client = useClient()

  return useMutation({
    mutationFn: async (nextAutomining: boolean) => {
      await client.setAutomine(nextAutomining)
      queryClient.setQueryData(queryKey, () => nextAutomining)
      if (nextAutomining) {
        await upsertNetwork({
          rpcUrl: network.rpcUrl,
          network: { blockTime: 0 },
        })
      }
    },
  })
}
