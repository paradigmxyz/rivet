import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Client, GetTransactionReceiptParameters, Hash } from 'viem'
import { createQueryKey } from '~/react-query'
import { useClient } from './useClient'

export const getTransactionQueryKey = createQueryKey<
  'transaction-receipt',
  [key: Client['key'], hash: Hash | (string & {})]
>('transaction-receipt')

export function useTransactionReceiptQueryOptions(
  args: GetTransactionReceiptParameters,
) {
  const client = useClient()
  return queryOptions({
    queryKey: getTransactionQueryKey([client.key, args.hash]),
    async queryFn() {
      return (await client.getTransactionReceipt(args)) || null
    },
  })
}

export function useTransactionReceipt(args: GetTransactionReceiptParameters) {
  const queryOptions = useTransactionReceiptQueryOptions(args)
  return useQuery(queryOptions)
}
