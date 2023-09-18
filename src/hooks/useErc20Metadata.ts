import { queryOptions, useQuery } from '@tanstack/react-query'
import { type Address, type Client, getContract } from 'viem'

import { erc20Abi } from '~/constants'
import { createQueryKey } from '~/react-query'

import { useClient } from './useClient'

type UseErc20MetadataParameters = {
  tokenAddress: Address
}

export const getErcBalanceQueryKey = createQueryKey<
  'erc20-metadata',
  [key: Client['key'], args: UseErc20MetadataParameters]
>('erc20-metadata')

export function useErc20MetadataQueryOptions({
  tokenAddress,
}: UseErc20MetadataParameters) {
  const client = useClient()

  return queryOptions({
    enabled: Boolean(tokenAddress),
    queryKey: getErcBalanceQueryKey([client.key, { tokenAddress }]),
    async queryFn() {
      const contract = getContract({
        address: tokenAddress,
        abi: erc20Abi,
        publicClient: client,
      })
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.read.name(),
        contract.read.symbol(),
        contract.read.decimals(),
        contract.read.totalSupply(),
      ])
      return {
        decimals,
        name,
        symbol,
        totalSupply,
      }
    },
  })
}

export function useErc20Metadata({ tokenAddress }: UseErc20MetadataParameters) {
  const queryOptions = useErc20MetadataQueryOptions({
    tokenAddress,
  })
  return useQuery(queryOptions)
}
