import { parseAbiItem } from 'abitype'
import type { BlockTag } from 'viem'
import { useAccountStore, useNetworkStore } from '~/zustand'
import { useGetLogs } from './useGetLogs'

type UseImportTransferredTokensParameters = {
  fromBlock?: bigint | BlockTag
  toBlock?: bigint | BlockTag
}

export function useImportTransferredTokens({
  fromBlock,
  toBlock,
}: UseImportTransferredTokensParameters = {}) {
  const { account } = useAccountStore()
  const { network } = useNetworkStore()

  const { data: transfersFrom } = useGetLogs({
    event: parseAbiItem(
      'event Transfer(address indexed from, address indexed to, uint256)',
    ),
    args: {
      from: account?.address,
    },
    fromBlock: fromBlock || network.forkBlockNumber,
    toBlock: toBlock || 'latest',
  })
  const { data: transfersTo } = useGetLogs({
    event: parseAbiItem(
      'event Transfer(address indexed from, address indexed to, uint256)',
    ),
    args: {
      to: account?.address,
    },
    fromBlock: fromBlock || network.forkBlockNumber,
    toBlock: toBlock || 'latest',
  })

  if (account?.address) {
    return [
      ...new Set([
        ...(transfersFrom?.map((t) => t.address) || []),
        ...(transfersTo?.map((t) => t.address) || []),
      ]),
    ]
  }

  return []
}
