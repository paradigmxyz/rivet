import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Address, Client } from 'viem'

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
      const contractConfig = {
        abi: erc20ABI,
        address: erc,
      }

      return await client.multicall({
        contracts: [
          {
            ...contractConfig,
            functionName: 'name',
          },
          {
            ...contractConfig,
            functionName: 'symbol',
          },
          {
            ...contractConfig,
            functionName: 'decimals',
          },
          {
            ...contractConfig,
            functionName: 'balanceOf',
            args: [address],
          },
        ],
        // multicallAddress: '',
      })
    },
  })
}

export function useErcBalance({ erc, address }: UseErcBalanceParameters) {
  const queryOptions = useErcBalanceQueryOptions({ erc, address })
  return useQuery(queryOptions)
}
