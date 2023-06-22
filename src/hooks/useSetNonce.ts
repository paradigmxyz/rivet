import { useMutation } from '@tanstack/react-query'
import type { SetNonceParameters } from 'viem'

import { queryClient } from '~/react-query'

import { useNonceQueryKey } from './useNonce'
import { usePublicClient } from './usePublicClient'
import { useTestClient } from './useTestClient'

export function useSetNonce() {
  const publicClient = usePublicClient()
  const testClient = useTestClient()

  return useMutation({
    async mutationFn({ address, nonce }: SetNonceParameters) {
      await testClient.setNonce({ address, nonce })
      queryClient.invalidateQueries({
        queryKey: useNonceQueryKey({ address, publicClient }),
      })
    },
  })
}
