import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  type BlockNumber,
  type BlockTag,
  type Client,
  type GetLogsParameters,
  stringify,
} from 'viem'

import { createQueryKey } from '~/react-query'

import type { AbiEvent } from 'abitype'
import { useClient } from './useClient'

type UseLogsParameters<
  TAbiEvent extends AbiEvent,
  TFromBlock extends BlockNumber | BlockTag,
  TToBlock extends BlockNumber | BlockTag,
> = GetLogsParameters<TAbiEvent, TAbiEvent[], undefined, TFromBlock, TToBlock>

export const getLogsQueryKey = createQueryKey<
  'get-logs',
  [key: Client['key'], args: string]
>('get-logs')

export function useGetLogsQueryOptions<
  TAbiEvent extends AbiEvent,
  TFromBlock extends BlockNumber | BlockTag,
  TToBlock extends BlockNumber | BlockTag,
>(parameters: UseLogsParameters<TAbiEvent, TFromBlock, TToBlock>) {
  const client = useClient()

  return queryOptions({
    enabled: Boolean(parameters),
    queryKey: getLogsQueryKey([client.key, stringify(parameters)]),
    async queryFn() {
      return await client.getLogs(parameters)
    },
  })
}

export function useGetLogs<
  TAbiEvent extends AbiEvent,
  TFromBlock extends BlockNumber | BlockTag,
  TToBlock extends BlockNumber | BlockTag,
>(parameters: UseLogsParameters<TAbiEvent, TFromBlock, TToBlock>) {
  const queryOptions = useGetLogsQueryOptions(parameters)
  return useQuery(queryOptions)
}
