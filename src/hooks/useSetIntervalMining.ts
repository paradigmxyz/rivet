import { useMutation } from '@tanstack/react-query'
import type { SetIntervalMiningParameters } from 'viem'

import { useNetworkStore } from '~/zustand'

import { useClient } from './useClient'
import { useSetAutomine } from './useSetAutomine'

export function useSetIntervalMining() {
  const { network, upsertNetwork } = useNetworkStore()
  const client = useClient()
  const { mutateAsync: setAutomine } = useSetAutomine()

  return useMutation({
    mutationFn: async ({ interval }: SetIntervalMiningParameters) => {
      await client.setIntervalMining({
        interval,
      })
      await upsertNetwork({
        rpcUrl: network.rpcUrl,
        network: { blockTime: interval },
      })
      if (interval > 0) await setAutomine(false)
    },
  })
}
