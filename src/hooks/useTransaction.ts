import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Client, GetTransactionParameters, Hash } from 'viem'
import { createQueryKey } from '~/react-query'
import { useClient } from './useClient'

export const getTransactionQueryKey = createQueryKey<
  'transaction',
  [key: Client['key'], hash: Hash | (string & {}), deps: string]
>('transaction')

export function useTransactionQueryOptions(
  args: GetTransactionParameters<'latest'>,
) {
  const client = useClient()
  return queryOptions({
    queryKey: getTransactionQueryKey([
      client.key,
      args.blockHash ||
        args.blockNumber?.toString() ||
        args.blockTag ||
        args.hash ||
        'latest',
    ]),
    async queryFn() {
      return (await client.getTransaction(args)) || null
    },
  })
}

export function useTransaction(args: GetTransactionParameters<'latest'>) {
  const queryOptions = useTransactionQueryOptions(args)
  return useQuery(queryOptions)
}
