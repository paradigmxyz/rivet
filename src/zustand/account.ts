import type { Address, JsonRpcAccount as JsonRpcAccount_ } from 'viem'

import { useSyncExternalStoreWithTracked } from '~/hooks'

import { createStore } from './utils'

// Only support JSON-RPC Accounts for now. In the future, we may want to add support
// for Private Key/HD Accounts.
type JsonRpcAccount = JsonRpcAccount_ & {
  rpcUrl: string
}
export type Account = JsonRpcAccount

export type AccountState = {
  account?: Account
  accounts: readonly Account[]
}
export type AccountActions = {
  accountsForRpcUrl({ rpcUrl }: { rpcUrl: string }): readonly Account[]
  setJsonRpcAccounts({
    addresses,
    rpcUrl,
  }: { addresses: Address[]; rpcUrl: string }): void
}
export type AccountStore = AccountState & AccountActions

export const accountStore = createStore<AccountStore>(
  (set, get) => ({
    account: undefined,
    accounts: [],

    accountsForRpcUrl({ rpcUrl }) {
      const { account, accounts } = get()
      return [
        // Current account first.
        ...(account ? [account] : []),
        // Other accounts after that.
        ...accounts.filter(
          (x) =>
            x.address !== account?.address &&
            (!x.rpcUrl || x.rpcUrl === rpcUrl),
        ),
      ]
    },
    setJsonRpcAccounts({ addresses, rpcUrl }) {
      const accounts = addresses.map(
        (address) =>
          ({
            address,
            rpcUrl,
            type: 'json-rpc',
          }) as const,
      )

      set((state) => {
        return {
          ...state,
          account: accounts[0],
          accounts: [
            ...state.accounts.filter((x) => x.rpcUrl !== rpcUrl),
            ...accounts,
          ],
        }
      })
    },
  }),
  {
    persist: {
      name: 'account',
      version: 0,
    },
  },
)

export const useAccount = () =>
  useSyncExternalStoreWithTracked(accountStore.subscribe, accountStore.getState)
