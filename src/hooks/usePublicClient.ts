import { useMemo } from 'react'

import { getPublicClient } from '~/viem'
import { useNetworkStore } from '~/zustand'

export function usePublicClient() {
  const {
    network: { rpcUrl },
  } = useNetworkStore()
  return useMemo(() => getPublicClient({ rpcUrl }), [rpcUrl])
}
