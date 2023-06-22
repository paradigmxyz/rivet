import { useMutation } from '@tanstack/react-query'
import type { SetBalanceParameters } from 'viem'

import { queryClient } from '~/react-query'

import { useBalanceQueryKey } from './useBalance'
import { usePublicClient } from './usePublicClient'
import { useTestClient } from './useTestClient'

export function useSetBalance() {
  const publicClient = usePublicClient()
  const testClient = useTestClient()

  return useMutation({
    async mutationFn({ address, value }: SetBalanceParameters) {
      await testClient.setBalance({ address, value })
      queryClient.invalidateQueries({
        queryKey: useBalanceQueryKey({ address, publicClient }),
      })
    },
  })
}
