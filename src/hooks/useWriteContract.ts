import { useMutation } from '@tanstack/react-query'
import type { Abi, Account, Chain, WriteContractParameters } from 'viem'

import { useClient } from './useClient'

type UseWriteContractParameters<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
> = WriteContractParameters<TAbi, TFunctionName, Chain, Account>

export function useWriteContract<
  const TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>() {
  const client = useClient()

  return useMutation({
    mutationFn(args: UseWriteContractParameters<TAbi, TFunctionName>) {
      return client.writeContract({ ...args, chain: null } as any)
    },
  })
}
