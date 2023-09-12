import { queryOptions, useQuery } from '@tanstack/react-query'
import { type Address, type Client, getContract } from 'viem'

import { createQueryKey } from '~/react-query'
import { erc20ABI } from '~/utils/abi'

import { useClient } from './useClient'

type UseErc20MetadataParameters = {
  address: Address
  contractAddress: Address
}

export const getErcBalanceQueryKey = createQueryKey<
  'erc-metadata',
  [key: Client['key'], args: UseErc20MetadataParameters]
>('erc-metadata')

export function useErc20MetadataQueryOptions({
  contractAddress,
  address,
}: UseErc20MetadataParameters) {
  const client = useClient()
  const contract = getContract({
    address: contractAddress,
    abi: erc20ABI,
    publicClient: client,
  })

  return queryOptions({
    enabled: Boolean(address),
    queryKey: getErcBalanceQueryKey([client.key, { contractAddress, address }]),
    async queryFn() {
      return Promise.all([
        contract.read.name(),
        contract.read.symbol(),
        contract.read.decimals(),
      ])
    },
  })
}

export function useErc20Metadata({
  contractAddress,
  address,
}: UseErc20MetadataParameters) {
  const queryOptions = useErc20MetadataQueryOptions({
    contractAddress,
    address,
  })
  return useQuery(queryOptions)
}
