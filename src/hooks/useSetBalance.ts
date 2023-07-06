import { useMutation } from '@tanstack/react-query'
import type { SetBalanceParameters } from 'viem'

import { queryClient } from '~/react-query'

import { getBalanceQueryKey } from './useBalance'
import { useClient } from './useClient'

export function useSetBalance() {
  const client = useClient()

  return useMutation({
    async mutationFn({ address, value }: SetBalanceParameters) {
      await client.setBalance({ address, value })
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryKey({ address, client }),
      })
    },
  })
}
