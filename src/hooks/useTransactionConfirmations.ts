import { useClient } from './useClient'
import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  type Client,
  type GetTransactionConfirmationsParameters,
  type Hash,
  stringify,
} from 'viem'
import { createQueryKey } from '~/react-query'

export const getTransactionQueryKey = createQueryKey<
  'transaction-confirmations',
  [key: Client['key'], hash: Hash | (string & {}), deps: string]
>('transaction-confirmations')

export function useTransactionReceiptQueryOptions(
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
  const queryOptions = useTransactionReceiptQueryOptions(args)
  return useQuery(queryOptions)
}
