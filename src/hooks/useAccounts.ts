import { useMemo } from 'react'
import { useAccountStore, useNetworkStore } from '~/zustand'

export function useAccounts() {
  const { accounts, getAccounts } = useAccountStore()
  const { network } = useNetworkStore()

  // rome-ignore lint/nursery/useExhaustiveDependencies:
  return useMemo(
    () => getAccounts({ rpcUrl: network.rpcUrl }),
    [accounts, network.rpcUrl],
  )
}
