import type { Address } from 'viem'
import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'
import { createStore } from './utils'

export type TokensState = {
  tokens: Record<Address, Address[]>
}
export type TokensActions = {
  addToken: (tokenAddress: Address, address: Address) => void
  removeToken: (tokenAddress: Address, address: Address) => void
}
export type TokensStore = TokensState & TokensActions

export const tokensStore = createStore<TokensStore>(
  (set, get) => ({
    tokens: {},
    addToken(tokenAddress: Address, address: Address) {
      if ((get().tokens[address] || []).find((token) => token === tokenAddress))
        return
      set((state) => {
        const tokens = { ...state.tokens }
        tokens[address] = [...(state.tokens[address] || []), tokenAddress]

        return {
          ...state,
          tokens,
        }
      })
    },
    removeToken(tokenAddress: Address, address: Address) {
      set((state) => {
        const tokens = { ...state.tokens }
        tokens[address] = tokens[address].filter(
          (token) => token !== tokenAddress,
        )
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
