import type { Client } from '~/viem'
import {
  type UseBlockParameters,
  getBlockQueryOptions,
} from '../hooks/useBlock'
import { getBytecodeQueryOptions } from '../hooks/useBytecode'
import { getTransactionReceiptQueryOptions } from '../hooks/useTransactionReceipt'
import { queryClient } from '../react-query'

export async function getContracts(
  client: Client,
  {
    fromBlock,
    toBlock = 'latest',
  }: {
    fromBlock: NonNullable<
      | UseBlockParameters['blockNumber']
      | Exclude<UseBlockParameters['blockTag'], 'pending'>
    >
    toBlock?:
      | UseBlockParameters['blockNumber']
      | Exclude<UseBlockParameters['blockTag'], 'pending'>
  },
) {
  const [fromBlockNumber, toBlockNumber] = await Promise.all([
    (async () => {
      if (typeof fromBlock === 'bigint') return fromBlock
      const block = await queryClient.fetchQuery(
        getBlockQueryOptions(client, { blockTag: fromBlock }),
      )
      return block.number
    })(),
    (async () => {
      if (typeof toBlock === 'bigint') return toBlock
      const block = await queryClient.fetchQuery(
        getBlockQueryOptions(client, { blockTag: toBlock }),
      )
      return block.number
    })(),
  ])

  const contracts = (
    await Promise.all(
      [...Array(Number(toBlockNumber - fromBlockNumber) + 1)].map(
        async (_, i) => {
          const blockNumber = fromBlockNumber + BigInt(i)
          const block = await queryClient.fetchQuery(
            getBlockQueryOptions(client, { blockNumber }),
          )

          const receipts = await Promise.all(
            block.transactions.map(async (transaction) => {
              const receipt = await queryClient.fetchQuery(
                getTransactionReceiptQueryOptions(client, {
                  hash: transaction,
                }),
              )
              const address = receipt.contractAddress
              if (!address) return null

              const bytecode = await queryClient.fetchQuery(
                getBytecodeQueryOptions(client, {
                  address,
                }),
              )

              return {
                address,
                bytecode,
                receipt,
              }
            }),
          )
          return receipts.filter(Boolean)
        },
      ),
    )
  ).flat()

  return contracts
}
