import { queryOptions, useQueries, useQuery } from '@tanstack/react-query'
import {
  type Account,
  type Chain,
  type Client,
  type Hex,
  type PrepareTransactionRequestParameters,
  type PrepareTransactionRequestReturnType,
  stringify,
} from 'viem'
import { prepareTransactionRequest } from 'viem/actions'

import { createQueryKey } from '~/react-query'

import { parseAccount } from 'viem/utils'
import { useClient } from './useClient'

export const getPrepareTransactionRequestQueryKey = createQueryKey<
  'prepareTransactionRequest',
  [
    key: Client['key'],
    account: PrepareTransactionRequestParameters['account'],
    deps: string,
  ]
>('prepareTransactionRequest')

export type GetPrepareTransactionRequestQueryOptionsParameters =
  PrepareTransactionRequestParameters<Chain, Account | undefined, Chain> & {
    from?: Hex
  }

export function getPrepareTransactionRequestQueryOptions(
  client: Client,
  args: GetPrepareTransactionRequestQueryOptionsParameters,
) {
  const { account } = args

  const initialData = {
    ...args,
    from: args.from ?? (account ? parseAccount(account).address : undefined),
    value: args.value ?? 0n,
  } as const

  return queryOptions({
    staleTime: 0,
    gcTime: 0,
    initialData: initialData as PrepareTransactionRequestReturnType,
    queryKey: getPrepareTransactionRequestQueryKey([
      client.key,
      account,
      stringify(args),
    ]),
    async queryFn() {
      const { account: _, ...preparedParams } = await prepareTransactionRequest(
        client,
        initialData as PrepareTransactionRequestParameters,
      )
      return preparedParams
    },
  })
}

export function usePrepareTransactionRequestQueryOptions(
  args: GetPrepareTransactionRequestQueryOptionsParameters,
) {
  const client = useClient()
  return getPrepareTransactionRequestQueryOptions(client, args)
}

export function usePrepareTransactionRequest(
  args: GetPrepareTransactionRequestQueryOptionsParameters,
) {
  const queryOptions = usePrepareTransactionRequestQueryOptions(args)
  return useQuery(queryOptions)
}

export type UsePrepareTransactionRequestsParameters = {
  requests: GetPrepareTransactionRequestQueryOptionsParameters[]
}

export function usePrepareTransactionRequests({
  requests,
}: UsePrepareTransactionRequestsParameters) {
  const client = useClient()
  return useQueries({
    queries: requests.map((request) =>
      getPrepareTransactionRequestQueryOptions(client, request),
    ),
  })
}
