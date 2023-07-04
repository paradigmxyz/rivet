import { useMemo } from 'react'

import { getWalletClient } from '~/viem'
import { useNetworkStore } from '~/zustand'

export function useWalletClient() {
  const {
    network: { rpcUrl },
  } = useNetworkStore()
  return useMemo(() => getWalletClient({ rpcUrl }), [rpcUrl])
}
