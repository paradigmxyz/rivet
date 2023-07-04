import { useMemo } from 'react'

import { getTestClient } from '~/viem'
import { useNetworkStore } from '~/zustand'

export function useTestClient() {
  const {
    network: { rpcUrl },
  } = useNetworkStore()
  return useMemo(() => getTestClient({ rpcUrl }), [rpcUrl])
}
