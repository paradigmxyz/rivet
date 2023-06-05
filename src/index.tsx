import './hmr'
import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { numberToHex } from 'viem'

import '~/design-system/styles/global.css'
import { useNetworkStatus, usePublicClient, useWalletClient } from '~/hooks'
import { getMessenger } from '~/messengers'
import { QueryClientProvider } from '~/react-query'
import { deepEqual } from '~/utils'
import {
  type AccountState,
  type NetworkState,
  syncStores,
  useAccount,
  useNetwork,
} from '~/zustand'

import Layout from './screens/_layout.tsx'
import Accounts from './screens/accounts.tsx'
import Index from './screens/index'
import Network from './screens/network.tsx'

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
        path: 'accounts',
        element: <Accounts />,
      },
      {
        path: 'network',
        element: <Network />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider>
    <AccountsChangedEmitter />
    <NetworkChangedEmitter />
    <SyncBlockNumber />
    <SyncJsonRpcAccounts />
    <SyncNetwork />
    <RouterProvider router={router} />
  </QueryClientProvider>,
)

////////////////////////////////////////////////////////////////////////////

const inpageMessenger = getMessenger({ connection: 'wallet <> inpage' })

/** Emits EIP-1193 `accountsChanged` Event */
function AccountsChangedEmitter() {
  const { account, accountsForRpcUrl } = useAccount()

  const prevAccounts = useRef<AccountState['accounts']>()
  // rome-ignore lint/nursery/useExhaustiveDependencies: `inpageMessenger` isn't stateful...
  useEffect(() => {
    if (!account) {
      prevAccounts.current = []
      return
    }

    let accounts_ = accountsForRpcUrl({ rpcUrl: account.rpcUrl })
    accounts_ = [
      account,
      ...accounts_.filter((x) => x.address !== account.address),
    ]

    if (prevAccounts.current && !deepEqual(prevAccounts.current, accounts_))
      inpageMessenger.send(
        'accountsChanged',
        accounts_.map((x) => x.address),
      )

    prevAccounts.current = accounts_
  }, [account])

  return null
}

/** Emits EIP-1193 `chainChanged` Event */
function NetworkChangedEmitter() {
  const { network } = useNetwork()

  const prevNetwork = useRef<NetworkState['network']>()
  useEffect(() => {
    if (!network.chainId) return

    if (prevNetwork.current && prevNetwork.current.chainId !== network.chainId)
      inpageMessenger.send('chainChanged', numberToHex(network.chainId))

    prevNetwork.current = network
  }, [network])

  return null
}

/** Keeps block number in sync. */
function SyncBlockNumber() {
  const { data: listening } = useNetworkStatus()
  const { setBlockNumber } = useNetwork()
  const publicClient = usePublicClient()

  useEffect(() => {
    if (!listening) return

    // TODO: Switch to viem `watchBlockNumber`.
    const interval = setInterval(() => {
      publicClient.getBlockNumber({ maxAge: 0 }).then((blockNumber) => {
        setBlockNumber({ rpcUrl: publicClient.key, blockNumber })
      })
    }, 1_000)
    return () => clearInterval(interval)
  }, [listening, publicClient, setBlockNumber])

  return null
}

/** Keeps accounts in sync with network. */
function SyncJsonRpcAccounts() {
  const { data: chainId } = useNetworkStatus()
  const walletClient = useWalletClient()
  const { accountsForRpcUrl, setJsonRpcAccounts } = useAccount()

  // rome-ignore lint/nursery/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    ;(async () => {
      const addresses = await walletClient.getAddresses()
      setJsonRpcAccounts({ addresses, rpcUrl: walletClient.key })
    })()
  }, [accountsForRpcUrl, chainId, setJsonRpcAccounts, walletClient])

  return null
}

/** Keeps network in sync (+ ensure chain id is up-to-date). */
function SyncNetwork() {
  useNetworkStatus()
  return null
}
