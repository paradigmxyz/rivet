import { useMutation } from '@tanstack/react-query'

import { queryClient } from '~/react-query'
import { useNetworkStore } from '~/zustand'

import { useGetAutomineQueryOptions } from './useGetAutomine'
import { useTestClient } from './useTestClient'

export function useSetAutomine() {
  const { queryKey } = useGetAutomineQueryOptions()
  const { network, upsertNetwork } = useNetworkStore()
  const testClient = useTestClient()

  return useMutation({
    mutationFn: async (nextAutomining: boolean) => {
      await testClient.setAutomine(nextAutomining)
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
