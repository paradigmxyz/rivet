import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  type BlockNumber,
  type BlockTag,
  type GetLogsParameters,
  stringify,
} from 'viem'

import { createQueryKey } from '~/react-query'

import type { AbiEvent } from 'abitype'
import type { Client } from '../viem'
import { useClient } from './useClient'

type UseLogsParameters<
  TAbiEvent extends AbiEvent,
  TFromBlock extends BlockNumber | BlockTag,
  TToBlock extends BlockNumber | BlockTag,
> = GetLogsParameters<
  TAbiEvent,
  TAbiEvent[],
  undefined,
  TFromBlock,
  TToBlock
> & {
  enabled?: boolean
}

export const getLogsQueryKey = createQueryKey<
  'get-logs',
  [key: Client['key'], args: string]
>('get-logs')

export function getLogsQueryOptions<
  TAbiEvent extends AbiEvent,
  TFromBlock extends BlockNumber | BlockTag,
  TToBlock extends BlockNumber | BlockTag,
>(client: Client, args: UseLogsParameters<TAbiEvent, TFromBlock, TToBlock>) {
  const { enabled = true, fromBlock, toBlock } = args

  return queryOptions({
    enabled,
    gcTime:
      typeof fromBlock === 'bigint' && typeof toBlock === 'bigint'
        ? Infinity
        : undefined,
    staleTime:
      typeof fromBlock === 'bigint' && typeof toBlock === 'bigint'
        ? Infinity
        : undefined,
    queryKey: getLogsQueryKey([client.key, stringify(args)]),
    async queryFn() {
      return await client.getLogs(args)
    },
  })
}

export function useGetLogsQueryOptions<
  TAbiEvent extends AbiEvent,
  TFromBlock extends BlockNumber | BlockTag,
  TToBlock extends BlockNumber | BlockTag,
>(args: UseLogsParameters<TAbiEvent, TFromBlock, TToBlock>) {
  const client = useClient()
  return getLogsQueryOptions(client, args)
}

export function useGetLogs<
  TAbiEvent extends AbiEvent,
  TFromBlock extends BlockNumber | BlockTag,
  TToBlock extends BlockNumber | BlockTag,
>(args: UseLogsParameters<TAbiEvent, TFromBlock, TToBlock>) {
  const queryOptions = useGetLogsQueryOptions(args)
  return useQuery(queryOptions)
}
