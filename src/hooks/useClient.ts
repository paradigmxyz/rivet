import { useMemo } from 'react'

import { getClient } from '~/viem'
import { useNetworkStore } from '~/zustand'

export function useClient() {
  const {
    network: { rpcUrl },
  } = useNetworkStore()
  return useMemo(() => getClient({ rpcUrl }), [rpcUrl])
}
