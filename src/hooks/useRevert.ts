import { useMutation } from '@tanstack/react-query'
import type { RevertParameters } from 'viem'

import { queryClient } from '~/react-query'

import { useClient } from './useClient'
import { usePendingBlockQueryOptions } from './usePendingBlock'

export function useRevert() {
  const client = useClient()
  const pendingBlockQueryOptions = usePendingBlockQueryOptions()

  return useMutation({
    mutationFn: async ({ id }: RevertParameters) => {
      await client.revert({
        id,
      })
      queryClient.invalidateQueries(pendingBlockQueryOptions)
    },
  })
}
