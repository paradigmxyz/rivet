import { useMutation } from '@tanstack/react-query'
import type { StopImpersonatingAccountParameters } from 'viem'

import { useClient } from './useClient'

export function useStopImpersonate() {
  const client = useClient()

  return useMutation({
    mutationFn: async ({ address }: StopImpersonatingAccountParameters) => {
      await client.stopImpersonatingAccount({ address })
    },
  })
}
