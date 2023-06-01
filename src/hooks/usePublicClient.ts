import { useMemo } from 'react'

import { getPublicClient } from '~/viem'
import { useNetwork } from '~/zustand'

export function usePublicClient() {
  const {
    network: { rpcUrl },
  } = useNetwork()
  return useMemo(() => getPublicClient({ rpcUrl }), [rpcUrl])
}
