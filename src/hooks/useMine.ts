import { useMutation } from '@tanstack/react-query'
import type { MineParameters } from 'viem'

import { queryClient } from '~/react-query'

import { useClient } from './useClient'
import { usePendingBlockQueryOptions } from './usePendingBlock'

export function useMine() {
  const client = useClient()
  const pendingBlockQueryOptions = usePendingBlockQueryOptions()

  return useMutation({
    mutationFn: async ({ blocks, interval = 0 }: MineParameters) => {
      await client.mine({
        blocks,
        interval,
      })
      if (Number(interval) === 0)
        queryClient.invalidateQueries(pendingBlockQueryOptions)
    },
  })
}
