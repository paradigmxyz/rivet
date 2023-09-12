import { queryOptions, useQuery } from '@tanstack/react-query'
import { type Address, type Client, getContract } from 'viem'

import { createQueryKey } from '~/react-query'
import { erc20ABI } from '~/utils/abi'

import { useClient } from './useClient'

type UseErc20BalanceParameters = {
  address: Address
  tokenAddress: Address
}

export const getErc20BalanceQueryKey = createQueryKey<
  'erc-balance',
  [key: Client['key'], args: UseErc20BalanceParameters]
>('erc-balance')

export function useErc20BalanceQueryOptions({
  address,
  tokenAddress,
}: UseErc20BalanceParameters) {
  const client = useClient()
  const contract = getContract({
    address: tokenAddress,
    abi: erc20ABI,
    publicClient: client,
  })

  return queryOptions({
    enabled: Boolean(address),
    queryKey: getErc20BalanceQueryKey([client.key, { tokenAddress, address }]),
    async queryFn() {
      return contract.read.balanceOf([address])
    },
  })
}

export function useErc20Balance({
  tokenAddress,
  address,
}: UseErc20BalanceParameters) {
  const queryOptions = useErc20BalanceQueryOptions({ tokenAddress, address })
  return useQuery(queryOptions)
}
