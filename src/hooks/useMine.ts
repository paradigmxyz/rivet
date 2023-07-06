import { useMutation } from '@tanstack/react-query'
import type { MineParameters } from 'viem'

import { queryClient } from '~/react-query'

import { useClient } from './useClient'
import { useCurrentBlockQueryOptions } from './useCurrentBlock'

export function useMine() {
  const client = useClient()
  const currentBlockQueryOptions = useCurrentBlockQueryOptions()

  return useMutation({
    mutationFn: async ({ blocks, interval = 0 }: MineParameters) => {
      await client.mine({
        blocks,
        interval,
      })
      if (Number(interval) === 0)
        queryClient.invalidateQueries(currentBlockQueryOptions)
    },
  })
}
