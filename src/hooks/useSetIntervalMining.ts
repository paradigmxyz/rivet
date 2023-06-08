import { useMutation } from '@tanstack/react-query'
import type { SetIntervalMiningParameters } from 'viem'

import { useNetwork } from '~/zustand'

import { useSetAutomine } from './useSetAutomine'
import { useTestClient } from './useTestClient'

export function useSetIntervalMining() {
  const { network, upsertNetwork } = useNetwork()
  const testClient = useTestClient()
  const { mutateAsync: setAutomine } = useSetAutomine()

  return useMutation({
    mutationFn: async ({ interval }: SetIntervalMiningParameters) => {
      await testClient.setIntervalMining({
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
