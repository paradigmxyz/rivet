import { useMutation } from '@tanstack/react-query'
import type { MineParameters } from 'viem'

import { queryClient } from '~/react-query'

import { useCurrentBlockQueryOptions } from './useCurrentBlock'
import { useTestClient } from './useTestClient'

export function useMine() {
  const testClient = useTestClient()
  const { queryKey } = useCurrentBlockQueryOptions()

  return useMutation({
    mutationFn: async ({ blocks, interval = 0 }: MineParameters) => {
      await testClient.mine({
        blocks,
        interval,
      })
      if (Number(interval) === 0) queryClient.invalidateQueries({ queryKey })
    },
  })
}
