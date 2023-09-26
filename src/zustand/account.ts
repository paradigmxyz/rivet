import type { Address, JsonRpcAccount as JsonRpcAccount_ } from 'viem'

import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'

import { uniqBy } from 'remeda'
import { createStore } from './utils'

// Only support JSON-RPC Accounts for now. In the future, we may want to add support
// for Private Key/HD Accounts.
type JsonRpcAccount = JsonRpcAccount_ & {
  rpcUrl: string
  impersonate?: boolean
}
export type Account = JsonRpcAccount & {
  displayName?: string
  key: string
  state: 'loaded' | 'loading'
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
  removeAccount({ account }: { account: Account }): void
  setJsonRpcAccounts({
    addresses,
    rpcUrl,
  }: { addresses: Address[]; rpcUrl: string }): void
  switchAccount(key: string): void
  upsertAccount({ account, key }: { account: Account; key?: string }): void
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
    removeAccount({ account }) {
      set((state) => {
        const accounts = state.accounts.filter((x) => x.key !== account.key)
        const account_ =
          state.account?.key === account.key ? accounts[0] : state.account
        return {
          ...state,
          account: account_,
          accounts,
        }
      })
    },
    setJsonRpcAccounts({ addresses, rpcUrl }) {
      const accounts = addresses.map(
        (address) =>
          ({
            address,
            key: `${rpcUrl}.${address}`,
            rpcUrl,
            state: 'loaded',
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
    switchAccount(key) {
      set((state) => {
        const account = state.accounts.find((account) => account.key === key)
        return {
          ...state,
          account,
        }
      })
    },
    upsertAccount({ account: account_, key: key_ }) {
      const key = key_ || account_.key

      set((state) => {
        const accounts = [...state.accounts]
        const index = accounts.findIndex((account) => account.key === key)

        const account = {
          ...(index >= 0 ? accounts[index] : {}),
          ...account_,
        }
        if (index >= 0) accounts[index] = account
        else accounts.unshift(account)

        return {
          ...state,
          ...(key === state.account?.key && {
            account,
          }),
          accounts: uniqBy(accounts, (x) => x.key),
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
