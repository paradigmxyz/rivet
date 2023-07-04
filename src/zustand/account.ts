import type { Address, JsonRpcAccount as JsonRpcAccount_ } from 'viem'

import { useSyncExternalStoreWithTracked } from '~/hooks'

import { createStore } from './utils'

// Only support JSON-RPC Accounts for now. In the future, we may want to add support
// for Private Key/HD Accounts.
type JsonRpcAccount = JsonRpcAccount_ & {
  rpcUrl: string
  impersonate?: boolean
}
export type Account = JsonRpcAccount & {
  displayName?: string
}

export type AccountState = {
  account?: Account
  accounts: readonly Account[]
}
export type AccountActions = {
  accountsForRpcUrl({
    activeFirst,
    rpcUrl,
  }: { activeFirst?: boolean; rpcUrl: string }): readonly Account[]
  addAccount({ account }: { account: Account }): void
  removeAccount({ account }: { account: Account }): void
  setAccount({ account }: { account: Account }): void
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

    accountsForRpcUrl({ activeFirst = false, rpcUrl }) {
      const { account, accounts } = get()
      let accounts_ = accounts.filter((x) => !x.rpcUrl || x.rpcUrl === rpcUrl)
      if (activeFirst)
        accounts_ = [
          ...(account ? [account] : []),
          ...accounts.filter((x) =>
            account ? x.address !== account.address : true,
          ),
        ]
      return accounts_
    },
    addAccount({ account }) {
      const { accounts } = get()
      if (
        accounts.some(
          (x) => x.address === account.address && x.rpcUrl === account.rpcUrl,
        )
      )
        return
      set((state) => ({
        accounts: [account, ...state.accounts],
      }))
    },
    removeAccount({ account }) {
      set((state) => {
        const accounts = state.accounts.filter(
          (x) => x.address !== account.address,
        )
        const account_ =
          state.account?.address === account.address
            ? accounts[0]
            : state.account
        console.log(account_, state.account?.address, account.address)
        return {
          ...state,
          account: account_,
          accounts,
        }
      })
    },
    setAccount({ account }) {
      set((state) => {
        return {
          ...state,
          account,
        }
      })
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
          account: get().account || accounts[0],
          accounts: [
            ...state.accounts.filter(
              (x) => x.rpcUrl !== rpcUrl || x.impersonate,
            ),
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

export const useAccountStore = () =>
  useSyncExternalStoreWithTracked(accountStore.subscribe, accountStore.getState)
