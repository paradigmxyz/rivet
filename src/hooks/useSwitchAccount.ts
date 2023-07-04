import { useMutation } from '@tanstack/react-query'

import { useImpersonate } from './useImpersonate'
import { useStopImpersonate } from './useStopImpersonate'
import { type Account, useAccountStore } from '~/zustand/account'

export function useSwitchAccount() {
  const { account: activeAccount, setAccount } = useAccountStore()
  const { mutateAsync: stopImpersonate } = useStopImpersonate()
  const { mutateAsync: impersonate } = useImpersonate()

  return useMutation({
    mutationFn: async ({ account }: { account: Account }) => {
      if (activeAccount?.impersonate)
        await stopImpersonate({
          address: activeAccount.address,
        })
      setAccount({ account })
      if (account.impersonate) await impersonate({ address: account.address })
    },
  })
}
