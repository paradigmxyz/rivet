import { uniqBy } from 'remeda'
import type { Address } from 'viem'
import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'
import { createStore } from './utils'

type Token = {
  address: Address
  removed: boolean
}

export type TokensState = {
  tokens: Record<Address, Token[]>
}
export type TokensActions = {
  addToken: (tokenAddress: Address, address: Address) => void
  removeToken: (tokenAddress: Address, address: Address) => void
  syncTokens: (tokenAddresses: Address[], address: Address) => void
}
export type TokensStore = TokensState & TokensActions

export const tokensStore = createStore<TokensStore>(
  (set) => ({
    tokens: {},
    addToken(tokenAddress: Address, accountAddress: Address) {
      set((state) => {
        const tokens = { ...state.tokens }
        tokens[accountAddress] = uniqBy(
          [
            { address: tokenAddress, removed: false },
            ...(state.tokens[accountAddress] || []),
          ],
          (x) => x.address,
        )

        return {
          ...state,
          tokens,
        }
      })
    },
    removeToken(tokenAddress: Address, accountAddress: Address) {
      set((state) => {
        const tokens = { ...state.tokens }
        tokens[accountAddress] = (state.tokens[accountAddress] || []).map(
          (token) => {
            if (token.address === tokenAddress)
              return {
                ...token,
                removed: true,
              }
            return token
          },
        )
        return {
          ...state,
          tokens,
        }
      })
    },
    syncTokens(tokenAddresses: Address[], accountAddress: Address) {
      set((state) => {
        const tokens = { ...state.tokens }

        for (const tokenAddress of tokenAddresses) {
          const exists = (tokens[accountAddress] || []).some(
            (x) => x.address === tokenAddress,
          )
          if (!exists)
            tokens[accountAddress] = [
              ...(tokens[accountAddress] || []),
              {
                address: tokenAddress,
                removed: false,
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
              removed: false,
            })),
          ]),
        ),
      } as TokensState_v1 as TokensStore
    }
    default:
      return persistedState as TokensStore
  }
}
