import { queryOptions, useQuery } from '@tanstack/react-query'
import type {
  BlockTag,
  Client,
  GetTransactionParameters as GetTransactionParameters_viem,
  Hash,
} from 'viem'
import { createQueryKey } from '~/react-query'
import { useClient } from './useClient'

type GetTransactionParameters<TBlockTag extends BlockTag = 'latest'> =
  GetTransactionParameters_viem<TBlockTag> & {
    enabled?: boolean
  }

export const getTransactionQueryKey = createQueryKey<
  'transaction',
  [key: Client['key'], hash: Hash | (string & {})]
>('transaction')

export function useTransactionQueryOptions<
  TBlockTag extends BlockTag = 'latest',
>(args: GetTransactionParameters<TBlockTag>) {
  const client = useClient()
  return queryOptions({
    enabled: args.enabled,
    queryKey: getTransactionQueryKey([
      client.key,
      args.blockHash ||
        args.blockNumber?.toString() ||
        args.blockTag ||
        args.hash ||
        'latest',
    ]),
    async queryFn() {
      return (await client.getTransaction<TBlockTag>(args)) || null
    },
  })
}

export function useTransaction<TBlockTag extends BlockTag = 'latest'>(
  args: GetTransactionParameters<TBlockTag>,
) {
  const queryOptions = useTransactionQueryOptions(args)
  return useQuery(queryOptions)
}
