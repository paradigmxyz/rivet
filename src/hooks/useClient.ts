import { useMemo } from 'react'

import { getClient } from '~/viem'
import { useNetworkStore } from '~/zustand'

export function useClient({ rpcUrl }: { rpcUrl?: string } = {}) {
  const { network } = useNetworkStore()
  return useMemo(
    () => getClient({ rpcUrl: rpcUrl || network.rpcUrl }),
    [network.rpcUrl, rpcUrl],
  )
}
