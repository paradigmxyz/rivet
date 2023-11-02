import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  type Abi,
  type BaseError,
  type CallParameters,
  type Client,
  type DecodeFunctionResultParameters,
  type EncodeFunctionDataParameters,
  type Hash,
  type ReadContractParameters as ReadContractParameters_viem,
  decodeFunctionResult,
  encodeFunctionData,
  getContractError,
  stringify,
} from 'viem'
import { createQueryKey } from '~/react-query'
import { useClient } from './useClient'

type ReadContractParameters<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> = ReadContractParameters_viem<TAbi, TFunctionName> & {
  enabled?: boolean
  raw?: boolean
}

export const readContractQueryKey = createQueryKey<
  'read-contract',
  [key: Client['key'], hash: Hash | (string & {})]
>('read-contract')

export function useReadContractQueryOptions<
  const TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
>(params: ReadContractParameters<TAbi, TFunctionName>) {
  const client = useClient()
  return queryOptions({
    enabled: params.enabled,
    queryKey: readContractQueryKey([client.key, stringify(params)]),
    async queryFn() {
      const { abi, address, args, functionName } = params
      const calldata = encodeFunctionData({
        abi,
        args,
        functionName,
      } as EncodeFunctionDataParameters)
      try {
        const { data } = await client.call({
          ...params,
          data: calldata,
          to: address,
        } as CallParameters)
        if (params.raw) return data || null
        return (
          decodeFunctionResult({
            abi,
            args,
            functionName,
            data: data || '0x',
          } as DecodeFunctionResultParameters) || null
        )
      } catch (err) {
        throw getContractError(err as BaseError, {
          abi: params.abi as Abi,
          args: params.args,
          functionName: params.functionName,
        })
      }
    },
  })
}

export function useReadContract<
  const TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
>(args: ReadContractParameters<TAbi, TFunctionName>) {
  const queryOptions = useReadContractQueryOptions(args)
  return useQuery(queryOptions)
}
