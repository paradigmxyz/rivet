import { useMemo } from 'react'
import { useAccountStore, useNetworkStore } from '~/zustand'

export function useAccounts() {
  const { accounts, accountsForRpcUrl } = useAccountStore()
  const { network } = useNetworkStore()

  return useMemo(
    () => accountsForRpcUrl({ rpcUrl: network.rpcUrl }),
    [accounts, network.rpcUrl],
  )
}
