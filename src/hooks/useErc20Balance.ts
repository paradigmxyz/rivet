import { queryOptions, useQuery } from '@tanstack/react-query'
import { type Address, type Client, getContract } from 'viem'

import { createQueryKey } from '~/react-query'
import { erc20ABI } from '~/utils/abi'

import { useClient } from './useClient'

type UseErc20BalanceParameters = {
  address: Address
  contractAddress: Address
}

export const getErc20BalanceQueryKey = createQueryKey<
  'erc-balance',
  [key: Client['key'], args: UseErc20BalanceParameters]
>('erc-balance')

export function useErc20BalanceQueryOptions({
  address,
  contractAddress,
}: UseErc20BalanceParameters) {
  const client = useClient()
  const contract = getContract({
    address: contractAddress,
    abi: erc20ABI,
    publicClient: client,
  })

  return queryOptions({
    enabled: Boolean(address),
    queryKey: getErc20BalanceQueryKey([
      client.key,
      { contractAddress, address },
    ]),
    async queryFn() {
      return contract.read.balanceOf([address])
    },
  })
}

export function useErc20Balance({
  contractAddress,
  address,
}: UseErc20BalanceParameters) {
  const queryOptions = useErc20BalanceQueryOptions({ contractAddress, address })
  return useQuery(queryOptions)
}
