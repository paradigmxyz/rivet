import { useMutation } from '@tanstack/react-query'
import type {
  Abi,
  Account,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
  WriteContractParameters,
} from 'viem'

import { useClient } from './useClient'

type UseWriteContractParameters<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
  TArgs extends ContractFunctionArgs<
    TAbi,
    'nonpayable' | 'payable',
    TFunctionName
  > = ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>,
> = WriteContractParameters<TAbi, TFunctionName, TArgs, Chain, Account>

export function useWriteContract<
  const TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
  TArgs extends ContractFunctionArgs<
    TAbi,
    'nonpayable' | 'payable',
    TFunctionName
  >,
>() {
  const client = useClient()

  return useMutation({
    mutationFn(args: UseWriteContractParameters<TAbi, TFunctionName, TArgs>) {
      return client.writeContract({ ...args, chain: null } as any)
    },
  })
}
