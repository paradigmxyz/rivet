import { queryOptions, useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { type Address, stringify } from 'viem'

import { getAccountTokens } from '~/actions'
import { createQueryKey } from '~/react-query'
import type { Client } from '~/viem'
import { useNetworkStore, useTokensStore } from '~/zustand'

import { getTokensKey } from '~/zustand/tokens'
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
      syncTokens({
        accountAddress: address,
        tokenAddresses: tokens,
        rpcUrl: network.rpcUrl,
      })
      return tokens
    },
  })
}

export function useAccountTokens(args: UseAccountTokensParameters) {
  const queryOptions = useAccountTokensQueryOptions(args)
  const tokensStore = useTokensStore()
  const { network } = useNetworkStore()

  const addToken = useCallback(
    (address: Address) =>
      args.address
        ? tokensStore.addToken({
            accountAddress: args.address,
            rpcUrl: network.rpcUrl,
            tokenAddress: address,
          })
        : undefined,
    [args.address, network.rpcUrl, tokensStore.addToken],
  )
  const removeToken = useCallback(
    (address: Address) =>
      args.address
        ? tokensStore.removeToken({
            accountAddress: args.address,
            rpcUrl: network.rpcUrl,
            tokenAddress: address,
          })
        : undefined,
    [args.address, network.rpcUrl, tokensStore.removeToken],
  )
  const tokens = useMemo(
    () =>
      args.address
        ? tokensStore.tokens[
            getTokensKey({
              accountAddress: args.address,
              rpcUrl: network.rpcUrl,
            })
          ]
            ?.map((token) => (!token.removed ? token.address : undefined))
            .filter(Boolean)
        : [],
    [args.address, network.rpcUrl, tokensStore.tokens],
  )

  return Object.assign(useQuery(queryOptions), {
    addToken,
    removeToken,
    tokens,
  })
}
