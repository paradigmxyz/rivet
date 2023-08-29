import { useClient } from './useClient'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Client, GetTransactionReceiptParameters, Hash } from 'viem'
import { createQueryKey } from '~/react-query'

export const getTransactionQueryKey = createQueryKey<
  'transaction-receipt',
  [key: Client['key'], hash: Hash | (string & {}), deps: string]
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
