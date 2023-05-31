import { useMemo } from 'react'

import { getPublicClient } from '~/viem'
import { useNetworksStore } from '~/zustand'

export function usePublicClient() {
  const {
    network: { rpcUrl },
  } = useNetworksStore()
  return useMemo(() => getPublicClient({ rpcUrl }), [rpcUrl])
}
