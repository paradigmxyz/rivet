import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  type Client,
  type GetTransactionConfirmationsParameters,
  type Hash,
  stringify,
} from 'viem'
import { createQueryKey } from '~/react-query'
import { useClient } from './useClient'

export const getTransactionQueryKey = createQueryKey<
  'transaction-confirmations',
  [key: Client['key'], hash: Hash | (string & {})]
>('transaction-confirmations')

export function useTransactionConfirmationsQueryOptions(
  args: GetTransactionConfirmationsParameters,
) {
  const client = useClient()
  return queryOptions({
    queryKey: getTransactionQueryKey([
      client.key,
      args.hash || stringify(args),
    ]),
    async queryFn() {
      return (await client.getTransactionConfirmations(args)) || null
    },
  })
}

export function useTransactionConfirmations(
  args: GetTransactionConfirmationsParameters,
) {
  const queryOptions = useTransactionConfirmationsQueryOptions(args)
  return useQuery(queryOptions)
}
