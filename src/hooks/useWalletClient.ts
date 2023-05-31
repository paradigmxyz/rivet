import { useMemo } from 'react'

import { getWalletClient } from '~/viem'
import { useNetworksStore } from '~/zustand'

export function useWalletClient() {
  const {
    network: { rpcUrl },
  } = useNetworksStore()
  return useMemo(() => getWalletClient({ rpcUrl }), [rpcUrl])
}
