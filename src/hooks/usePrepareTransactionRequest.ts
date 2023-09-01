import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  type Client,
  type Hex,
  type PrepareTransactionRequestParameters,
  stringify,
} from 'viem'

import { createQueryKey } from '~/react-query'

import { useClient } from './useClient'

export type UsePrepareTransactionRequestParameters =
  PrepareTransactionRequestParameters & {
    from?: Hex
  }

export const getNonceQueryKey = createQueryKey<
  'prepareTransactionRequest',
  [
    key: Client['key'],
    account: UsePrepareTransactionRequestParameters['account'],
    deps: string,
  ]
>('prepareTransactionRequest')

export function usePrepareTransactionRequestQueryOptions(
  args: UsePrepareTransactionRequestParameters,
) {
  const client = useClient()
  return queryOptions({
    gcTime: 0,
    queryKey: getNonceQueryKey([client.key, args.account, stringify(args)]),
    async queryFn() {
      const { account: _, ...preparedParams } =
        await client.prepareTransactionRequest({
          ...args,
          account: args.from || args.account,
          value: args.value ?? 0n,
        } as unknown as PrepareTransactionRequestParameters)
      return preparedParams
    },
  })
}

export function usePrepareTransactionRequest(
  args: UsePrepareTransactionRequestParameters,
) {
  const queryOptions = usePrepareTransactionRequestQueryOptions(args)
  return useQuery(queryOptions)
}
