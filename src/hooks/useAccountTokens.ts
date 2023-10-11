import { queryOptions, useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { type Address, stringify } from 'viem'

import { getAccountTokens } from '~/actions'
import { createQueryKey } from '~/react-query'
import type { Client } from '~/viem'
import { useNetworkStore, useTokensStore } from '~/zustand'

import { type TokensActions, getTokensKey } from '~/zustand/tokens'
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
      syncTokens(
        {
          accountAddress: address,
          rpcUrl: network.rpcUrl,
        },
        {
          tokenAddresses: tokens,
        },
      )
      return tokens
    },
  })
}

export function useAccountTokens({ address }: UseAccountTokensParameters) {
  const queryOptions = useAccountTokensQueryOptions({ address })
  const tokensStore = useTokensStore()
  const { network } = useNetworkStore()

  const addToken = useCallback(
    (args: Parameters<TokensActions['addToken']>[1]) =>
      address
        ? tokensStore.addToken(
            {
              accountAddress: address,
              rpcUrl: network.rpcUrl,
            },
            args,
          )
        : undefined,
    [address, network.rpcUrl, tokensStore.addToken],
  )

  const hideToken = useCallback(
    (args: Parameters<TokensActions['hideToken']>[1]) =>
      address
        ? tokensStore.hideToken(
            {
              accountAddress: address,
              rpcUrl: network.rpcUrl,
            },
            args,
          )
        : undefined,
    [address, network.rpcUrl, tokensStore.hideToken],
  )

  const removeToken = useCallback(
    (args: Parameters<TokensActions['removeToken']>[1]) =>
      address
        ? tokensStore.removeToken(
            {
              accountAddress: address,
              rpcUrl: network.rpcUrl,
            },
            args,
          )
        : undefined,
    [address, network.rpcUrl, tokensStore.removeToken],
  )

  const tokens = useMemo(
    () =>
      address
        ? tokensStore.tokens[
            getTokensKey({
              accountAddress: address,
              rpcUrl: network.rpcUrl,
            })
          ]
        : [],
    [address, network.rpcUrl, tokensStore.tokens],
  )

  return Object.assign(useQuery(queryOptions), {
    addToken,
    hideToken,
    removeToken,
    tokens,
  })
}
