import { useMutation } from '@tanstack/react-query'
import type { StopImpersonatingAccountParameters } from 'viem'

import { useTestClient } from './useTestClient'

export function useStopImpersonate() {
  const testClient = useTestClient()

  return useMutation({
    mutationFn: async ({ address }: StopImpersonatingAccountParameters) => {
      await testClient.stopImpersonatingAccount({ address })
    },
  })
}
