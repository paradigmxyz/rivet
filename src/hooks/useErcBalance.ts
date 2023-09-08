import { queryOptions, useQuery } from '@tanstack/react-query'
import { type Address, type Client, getContract } from 'viem'

import { createQueryKey } from '~/react-query'
import { erc20ABI } from '~/utils/abi'

import { useClient } from './useClient'

type UseErcBalanceParameters = {
  address: Address
  erc: Address
}

export const getErcBalanceQueryKey = createQueryKey<
  'erc-balance',
  [key: Client['key'], args: UseErcBalanceParameters]
>('erc-balance')

export function useErcBalanceQueryOptions({
  erc,
  address,
}: UseErcBalanceParameters) {
  const client = useClient()
  return queryOptions({
    enabled: Boolean(address),
    queryKey: getErcBalanceQueryKey([client.key, { erc, address }]),
    async queryFn() {
      const contract = getContract({
        address: erc,
        abi: erc20ABI,
        publicClient: client,
      })

      return Promise.all([
        contract.read.name(),
        contract.read.symbol(),
        contract.read.decimals(),
        contract.read.balanceOf([address]),
      ])
    },
  })
}

export function useErcBalance({ erc, address }: UseErcBalanceParameters) {
  const queryOptions = useErcBalanceQueryOptions({ erc, address })
  return useQuery(queryOptions)
}
