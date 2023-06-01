import { useMemo } from 'react'

import { getWalletClient } from '~/viem'
import { useNetwork } from '~/zustand'

export function useWalletClient() {
  const {
    network: { rpcUrl },
  } = useNetwork()
  return useMemo(() => getWalletClient({ rpcUrl }), [rpcUrl])
}
