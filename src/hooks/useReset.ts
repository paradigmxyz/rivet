import { useMutation } from '@tanstack/react-query'
import type { Client, ResetParameters } from 'viem'
import { createQueryKey, queryClient } from '~/react-query'
import { useClient } from './useClient'
import { getInfiniteBlocksQueryKey } from './useInfiniteBlocks'
// import { getInfiniteBlocksQueryKey } from './useInfiniteBlocks'

export const getAutomineQueryKey = createQueryKey<
  'reset',
  [key: Client['key']]
>('reset')

export function useReset() {
  const client = useClient()

  return useMutation({
    mutationFn: async (args?: ResetParameters) => {
      await client.reset(args)
      //   await queryClient.invalidateQueries()
      await queryClient.resetQueries({ queryKey: getInfiniteBlocksQueryKey() })
      //   await queryClient.resetQueries({ queryKey: getInfiniteBlocksQueryKey() })
    },
  })
}
