import type { Address } from 'viem'
import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'
import { createStore } from './utils'

export type TokensState = {
  tokens: Address[]
}
export type TokensActions = {
  addToken: (address: Address) => void
  removeToken: (address: Address) => void
}
export type TokensStore = TokensState & TokensActions

export const tokensStore = createStore<TokensStore>(
  (set, get) => ({
    tokens: [],
    addToken(address: Address) {
      if (get().tokens.find((token) => token === address)) return
      set((state) => ({
        ...state,
        tokens: [...state.tokens, address],
      }))
    },
    removeToken(address: Address) {
      set((state) => {
        const tokens = state.tokens.filter((token) => token !== address)
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
      version: 0,
    },
  },
)

export const useTokensStore = () =>
  useSyncExternalStoreWithTracked(tokensStore.subscribe, tokensStore.getState)
