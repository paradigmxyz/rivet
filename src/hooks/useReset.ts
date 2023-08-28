import { useMutation } from '@tanstack/react-query'
import type { Client, ResetParameters } from 'viem'
import { createQueryKey } from '~/react-query'
import { useClient } from './useClient'

export const getAutomineQueryKey = createQueryKey<
  'reset',
  [key: Client['key']]
>('reset')

export function useReset() {
  const client = useClient()

  return useMutation({
    mutationFn: async (args?: ResetParameters) => {
      await client.reset(args)
    },
  })
}
