import { useMutation } from '@tanstack/react-query'

import { type Account, useAccountStore } from '~/zustand/account'

import { useImpersonate } from './useImpersonate'
import { useStopImpersonate } from './useStopImpersonate'

export function useSetAccount() {
  const { account: activeAccount, upsertAccount } = useAccountStore()
  const { mutateAsync: stopImpersonate } = useStopImpersonate()
  const { mutateAsync: impersonate } = useImpersonate()

  return useMutation({
    mutationFn: async ({ account }: { account: Account }) => {
      if (activeAccount?.impersonate)
        await stopImpersonate({
          address: activeAccount.address,
        })
      upsertAccount({ account })
      if (account.impersonate) await impersonate({ address: account.address })
    },
  })
}
