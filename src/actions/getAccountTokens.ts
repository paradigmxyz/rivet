import { type Address, parseAbiItem } from 'abitype'
import type { GetLogsParameters } from 'viem'

import { getLogsQueryOptions } from '~/hooks/useGetLogs'
import { queryClient } from '~/react-query'
import type { Client } from '~/viem'

export async function getAccountTokens(
  client: Client,
  {
    address,
    fromBlock,
    toBlock,
  }: {
    address: Address
    fromBlock: GetLogsParameters['fromBlock']
    toBlock: GetLogsParameters['toBlock']
  },
) {
  const [transfersFrom, transfersTo] = await Promise.all([
    queryClient.fetchQuery(
      getLogsQueryOptions(client, {
        event: parseAbiItem(
          'event Transfer(address indexed from, address indexed to, uint256)',
        ),
        args: {
          from: address,
        },
        fromBlock,
        toBlock,
      }),
    ),
    queryClient.fetchQuery(
      getLogsQueryOptions(client, {
        event: parseAbiItem(
          'event Transfer(address indexed from, address indexed to, uint256)',
        ),
        args: {
          to: address,
        },
        fromBlock,
        toBlock,
      }),
    ),
  ])

  // TODO: Check if log addresses are ERC20 tokens.

  return [
    ...new Set([
      ...(transfersFrom?.map((t) => t.address) || []),
      ...(transfersTo?.map((t) => t.address) || []),
    ]),
  ]
}
