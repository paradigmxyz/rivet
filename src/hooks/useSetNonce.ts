import { useMutation } from '@tanstack/react-query'
import type { SetNonceParameters } from 'viem'

import { queryClient } from '~/react-query'

import { useClient } from './useClient'
import { useNonceQueryKey } from './useNonce'

export function useSetNonce() {
  const client = useClient()

  return useMutation({
    async mutationFn({ address, nonce }: SetNonceParameters) {
      await client.setNonce({ address, nonce })
      queryClient.invalidateQueries({
        queryKey: useNonceQueryKey({ address, client }),
      })
    },
  })
}
