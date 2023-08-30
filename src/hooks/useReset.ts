import { useMutation } from '@tanstack/react-query'
import type { ResetParameters } from 'viem'
import { useClient } from './useClient'

export function useReset() {
  const client = useClient()

  return useMutation({
    mutationFn: async (args?: ResetParameters) => {
      await client.reset(args)
    },
  })
}
