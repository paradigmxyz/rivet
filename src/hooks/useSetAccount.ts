import { useMutation } from '@tanstack/react-query'

import { type Account, useAccountStore } from '~/zustand/account'

import { useImpersonate } from './useImpersonate'
import { useStopImpersonate } from './useStopImpersonate'

export type SetAccountParameters = {
  account: Omit<Account, 'key' | 'state'>
  key?: string
  setActive?: boolean
}

export function useSetAccount() {
  const {
    account: activeAccount,
    switchAccount,
    upsertAccount,
  } = useAccountStore()
  const { mutateAsync: stopImpersonate } = useStopImpersonate()
  const { mutateAsync: impersonate } = useImpersonate()

  return useMutation({
    mutationFn: async ({ account, key, setActive }: SetAccountParameters) => {
      if (activeAccount?.impersonate)
        await stopImpersonate({
          address: activeAccount.address,
        })
      const key_ = `${account.rpcUrl}.${account.address}`
      upsertAccount({
        key,
        account: {
          ...account,
          key: key_,
          state: 'loaded',
        },
      })
      if (setActive) switchAccount(key_)
      if (account.impersonate) await impersonate({ address: account.address })
    },
  })
}
