import { useMemo } from 'react'

import { getTestClient } from '~/viem'
import { useNetwork } from '~/zustand'

export function useTestClient() {
  const {
    network: { rpcUrl },
  } = useNetwork()
  return useMemo(() => getTestClient({ rpcUrl }), [rpcUrl])
}
