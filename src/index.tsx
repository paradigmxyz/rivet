import './hmr'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { numberToHex } from 'viem'

import '~/design-system/styles/global.css'
import { useNetworkStatus } from '~/hooks'
import { getMessenger } from '~/messengers'
import { QueryClientProvider } from '~/react-query'
import { type NetworkState, syncStores, useNetwork } from '~/zustand'

import Layout from './screens/_layout.tsx'
import Index from './screens/index'
import NetworkConfig from './screens/network-config.tsx'

syncStores()

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Index />,
      },
      {
        path: 'network-config',
        element: <NetworkConfig />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider>
      <ProviderEvents />
      <SyncNetwork />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)

////////////////////////////////////////////////////////////////////////////

const inpageMessenger = getMessenger({ connection: 'wallet <> inpage' })

/** Emits EIP-1193 Provider Events */
function ProviderEvents() {
  const { network } = useNetwork()

  const prevNetwork = useRef<NetworkState['network']>()
  // rome-ignore lint/nursery/useExhaustiveDependencies: rome bugged
  useEffect(() => {
    if (
      prevNetwork.current &&
      prevNetwork.current.chainId !== network.chainId
    ) {
      inpageMessenger.send('chainChanged', numberToHex(network.chainId))
    }
    prevNetwork.current = network
  }, [network])

  return null
}

/** Keeps network in sync (+ ensure chain id is up-to-date). */
function SyncNetwork() {
  useNetworkStatus()
  return null
}
