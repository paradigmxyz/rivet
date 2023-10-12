import { uniqBy } from 'remeda'
import type { Address } from 'viem'
import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'
import { createStore, getKey } from './utils'

export type Token = {
  address: Address
  visible: boolean
}

export type TokensKey = {
  accountAddress: Address
  rpcUrl: string
}
export type SerializedTokensKey = string

export type TokensState = {
  tokens: Record<SerializedTokensKey, Token[]>
}

export type TokensActions = {
  addToken: (
    key: TokensKey,
    parameters: {
      tokenAddress: Address
    },
  ) => void
  hideToken: (
    key: TokensKey,
    parameters: {
      tokenAddress: Address
    },
  ) => void
  removeToken: (
    key: TokensKey,
    parameters: {
      tokenAddress: Address
    },
  ) => void
  syncTokens: (
    key: TokensKey,
    parameters: {
      tokenAddresses: Address[]
    },
  ) => void
}
export type TokensStore = TokensState & TokensActions

export function getTokensKey(key: TokensKey): SerializedTokensKey {
  return getKey(Object.values(key))
}

export const tokensStore = createStore<TokensStore>(
  (set) => ({
    tokens: {},
    addToken(key, args) {
      const { tokenAddress } = args
      const serializedKey = getTokensKey(key)

      set((state) => {
        const tokens = { ...state.tokens }
        tokens[serializedKey] = uniqBy(
          [
            { address: tokenAddress, visible: true },
            ...(state.tokens[serializedKey] || []),
          ],
          (x) => x.address,
        )

        return {
          ...state,
          tokens,
        }
      })
    },
    hideToken(key, args) {
      const { tokenAddress } = args
      const serializedKey = getTokensKey(key)

      set((state) => {
        const tokens = { ...state.tokens }
        tokens[serializedKey] = (state.tokens[serializedKey] || []).map(
          (token) => {
            if (token.address === tokenAddress)
              return {
                ...token,
                visible: false,
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
    removeToken(key, args) {
      const { tokenAddress } = args
      const serializedKey = getTokensKey(key)

      set((state) => {
        const tokens = { ...state.tokens }
        tokens[serializedKey] = (state.tokens[serializedKey] || []).filter(
          (token) => token.address !== tokenAddress,
        )
        return {
          ...state,
          tokens,
        }
      })
    },
    syncTokens(key, args) {
      const { tokenAddresses } = args
      const serializedKey = getTokensKey(key)

      set((state) => {
        const tokens = { ...state.tokens }

        for (const tokenAddress of tokenAddresses) {
          const exists = (tokens[serializedKey] || []).some(
            (x) => x.address === tokenAddress,
          )
          if (!exists)
            tokens[serializedKey] = [
              {
                address: tokenAddress,
                visible: true,
              },
              ...(tokens[serializedKey] || []),
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
