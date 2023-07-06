import { useMutation } from '@tanstack/react-query'
import type { ImpersonateAccountParameters } from 'viem'

import { useClient } from './useClient'

export function useImpersonate() {
  const client = useClient()

  return useMutation({
    mutationFn: async ({ address }: ImpersonateAccountParameters) => {
      await client.impersonateAccount({ address })
    },
  })
}
