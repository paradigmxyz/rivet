import { uniqBy } from 'remeda'
import type { Address } from 'viem'
import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'
import { createStore } from './utils'

type Token = {
  address: Address
  visible: boolean
}

type TokensKey = string

export type TokensState = {
  tokens: Record<TokensKey, Token[]>
}

export type TokensActions = {
  addToken: (parameters: {
    accountAddress: Address
    tokenAddress: Address
    rpcUrl: string
  }) => void
  hideToken: (parameters: {
    accountAddress: Address
    tokenAddress: Address
    rpcUrl: string
  }) => void
  removeToken: (parameters: {
    accountAddress: Address
    tokenAddress: Address
    rpcUrl: string
  }) => void
  syncTokens: (parameters: {
    accountAddress: Address
    tokenAddresses: Address[]
    rpcUrl: string
  }) => void
}
export type TokensStore = TokensState & TokensActions

export function getTokensKey(args: {
  accountAddress: Address
  rpcUrl: string
}): TokensKey {
  const { accountAddress, rpcUrl } = args
  return `${rpcUrl}-${accountAddress}`.replace(/\./g, '-')
}

export const tokensStore = createStore<TokensStore>(
  (set) => ({
    tokens: {},
    addToken(args) {
      const { accountAddress, tokenAddress, rpcUrl } = args
      const key = getTokensKey({ accountAddress, rpcUrl })

      set((state) => {
        const tokens = { ...state.tokens }
        tokens[key] = uniqBy(
          [
            { address: tokenAddress, visible: true },
            ...(state.tokens[key] || []),
          ],
          (x) => x.address,
        )

        return {
          ...state,
          tokens,
        }
      })
    },
    hideToken(args) {
      const { accountAddress, tokenAddress, rpcUrl } = args
      const key = getTokensKey({ accountAddress, rpcUrl })

      set((state) => {
        const tokens = { ...state.tokens }
        tokens[key] = (state.tokens[key] || []).map((token) => {
          if (token.address === tokenAddress)
            return {
              ...token,
              visible: false,
            }
          return token
        })
        return {
          ...state,
          tokens,
        }
      })
    },
    removeToken(args) {
      const { accountAddress, tokenAddress, rpcUrl } = args
      const key = getTokensKey({ accountAddress, rpcUrl })

      set((state) => {
        const tokens = { ...state.tokens }
        tokens[key] = (state.tokens[key] || []).filter(
          (token) => token.address !== tokenAddress,
        )
        return {
          ...state,
          tokens,
        }
      })
    },
    syncTokens(args) {
      const { accountAddress, tokenAddresses, rpcUrl } = args
      const key = getTokensKey({ accountAddress, rpcUrl })

      set((state) => {
        const tokens = { ...state.tokens }

        for (const tokenAddress of tokenAddresses) {
          const exists = (tokens[key] || []).some(
            (x) => x.address === tokenAddress,
          )
          if (!exists)
            tokens[key] = [
              ...(tokens[key] || []),
              {
                address: tokenAddress,
                visible: true,
              },
            ]
        }

        return {
          ...state,
          tokens,
        }
      })
    },
  }),
  {
    persist: {
      name: 'tokens',
      migrate,
      version: 1,
    },
  },
)

export const useTokensStore = () =>
  useSyncExternalStoreWithTracked(tokensStore.subscribe, tokensStore.getState)

///////////////////////////////////////////////////////////////////////////////////////
// Migrations

export type TokensState_v1 = TokensState

export type TokensState_v0 = {
  tokens: Record<Address, Address[]>
}

function migrate(persistedState: unknown, version: number): TokensStore {
  switch (version) {
    case 0: {
      const state = persistedState as TokensState_v0
      return {
        tokens: Object.fromEntries(
          Object.entries(state.tokens).map(([address, tokenAddresses]) => [
            address,
            tokenAddresses.map((tokenAddress) => ({
              address: tokenAddress,
              visible: false,
            })),
          ]),
        ),
      } as TokensState_v1 as TokensStore
    }
    default:
      return persistedState as TokensStore
  }
}
