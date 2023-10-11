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
      syncTokens({
        accountAddress: address,
        tokenAddresses: tokens,
        rpcUrl: network.rpcUrl,
      })
      return tokens
    },
  })
}

export function useAccountTokens({ address }: UseAccountTokensParameters) {
  const queryOptions = useAccountTokensQueryOptions({ address })
  const tokensStore = useTokensStore()
  const { network } = useNetworkStore()

  type AddTokenParameters = Omit<
    Parameters<TokensActions['addToken']>[0],
    'accountAddress' | 'rpcUrl'
  >
  const addToken = useCallback(
    (args: AddTokenParameters) =>
      address
        ? tokensStore.addToken({
            ...args,
            accountAddress: address,
            rpcUrl: network.rpcUrl,
          })
        : undefined,
    [address, network.rpcUrl, tokensStore.addToken],
  )

  type HideTokenParameters = Omit<
    Parameters<TokensActions['hideToken']>[0],
    'accountAddress' | 'rpcUrl'
  >
  const hideToken = useCallback(
    (args: HideTokenParameters) =>
      address
        ? tokensStore.hideToken({
            ...args,
            accountAddress: address,
            rpcUrl: network.rpcUrl,
          })
        : undefined,
    [address, network.rpcUrl, tokensStore.hideToken],
  )

  type RemoveTokenParameters = Omit<
    Parameters<TokensActions['removeToken']>[0],
    'accountAddress' | 'rpcUrl'
  >
  const removeToken = useCallback(
    (args: RemoveTokenParameters) =>
      address
        ? tokensStore.removeToken({
            ...args,
            accountAddress: address,
            rpcUrl: network.rpcUrl,
          })
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
