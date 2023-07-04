import { useMutation } from '@tanstack/react-query'
import type { ImpersonateAccountParameters } from 'viem'

import { useTestClient } from './useTestClient'

export function useImpersonate() {
  const testClient = useTestClient()

  return useMutation({
    mutationFn: async ({ address }: ImpersonateAccountParameters) => {
      await testClient.impersonateAccount({ address })
    },
  })
}
