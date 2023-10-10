import { queryOptions, useQuery } from '@tanstack/react-query'
import { type Address, stringify } from 'viem'

import { getAccountTokens } from '~/actions'
import { createQueryKey } from '~/react-query'
import type { Client } from '~/viem'
import { useNetworkStore, useTokensStore } from '~/zustand'

import { useCallback, useMemo } from 'react'
import { useClient } from './useClient'

type UseAccountTokensParameters = {
  address?: Address
}

export const getAccountTokensQueryKey = createQueryKey<
  'account-tokens',
  [key: Client['key'], address: Address | undefined, args: string]
>('account-tokens')

export function useAccountTokensQueryOptions(args: UseAccountTokensParameters) {
  const { address } = args

  const { syncTokens } = useTokensStore()
  const { network } = useNetworkStore()
  const client = useClient()

  return queryOptions({
    enabled: Boolean(address && network.forkBlockNumber),
    queryKey: getAccountTokensQueryKey([client.key, address, stringify(args)]),
    async queryFn() {
      if (!address) throw new Error('address is required')
      const tokens = await getAccountTokens(client, {
        address,
        fromBlock: network.forkBlockNumber,
        toBlock: 'latest',
      })
      syncTokens(tokens, address)
      return tokens
    },
  })
}

export function useAccountTokens(args: UseAccountTokensParameters) {
  const queryOptions = useAccountTokensQueryOptions(args)
  const tokensStore = useTokensStore()

  const addToken = useCallback(
    (address: Address) =>
      args.address ? tokensStore.addToken(address, args.address) : undefined,
    [args.address, tokensStore.addToken],
  )
  const removeToken = useCallback(
    (address: Address) =>
      args.address ? tokensStore.removeToken(address, args.address) : undefined,
    [args.address, tokensStore.removeToken],
  )
  const tokens = useMemo(
    () =>
      args.address
        ? tokensStore.tokens[args.address]
            ?.map((token) => (!token.removed ? token.address : undefined))
            .filter(Boolean)
        : [],
    [args.address, tokensStore.tokens],
  )

  return Object.assign(useQuery(queryOptions), {
    addToken,
    removeToken,
    tokens,
  })
}
