import './hmr'
import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { numberToHex } from 'viem'

import { getTheme, setTheme } from '~/design-system'
import '~/design-system/styles/global.css'
import { useNetworkStatus } from '~/hooks'
import { useClient } from '~/hooks/useClient'
import { usePendingBlock } from '~/hooks/usePendingBlock'
import { usePrevious } from '~/hooks/usePrevious'
import { getMessenger } from '~/messengers'
import { QueryClientProvider, queryClient } from '~/react-query'
import { deepEqual } from '~/utils'
import {
  type AccountState,
  type NetworkState,
  syncStores,
  useAccountStore,
  useNetworkStore,
  useSessionsStore,
} from '~/zustand'

import Layout from './screens/_layout.tsx'
import AccountConfig from './screens/account-config.tsx'
import BlockConfig from './screens/block-config.tsx'
import Index from './screens/index'
import NetworkConfig from './screens/network-config.tsx'
import OnboardingConfigure from './screens/onboarding/configure.tsx'
import OnboardingDeploy from './screens/onboarding/deploy.tsx'
import OnboardingDownload from './screens/onboarding/download.tsx'
import OnboardingRun from './screens/onboarding/run.tsx'
import OnboardingStart from './screens/onboarding/start.tsx'
import Session from './screens/session.tsx'

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
        path: 'account-config',
        element: <AccountConfig />,
      },
      {
        path: 'block-config',
        element: <BlockConfig />,
      },
      {
        path: 'network-config',
        element: <NetworkConfig />,
      },
      {
        path: 'session',
        element: <Session />,
      },
      {
        path: 'onboarding',
        children: [
          {
            path: '',
            element: <OnboardingStart />,
          },
          {
            path: 'download',
            element: <OnboardingDownload />,
          },
          {
            path: 'configure',
            element: <OnboardingConfigure />,
          },
          {
            path: 'deploy',
            element: <OnboardingDeploy />,
          },
          {
            path: 'run',
            element: <OnboardingRun />,
          },
        ],
      },
    ],
  },
])

// Handle requests from background to toggle the theme.
const backgroundMessenger = getMessenger({ connection: 'background <> wallet' })
backgroundMessenger.reply('toggleTheme', async () => {
  const { storageTheme, systemTheme } = getTheme()
  const theme = storageTheme || systemTheme
  setTheme(theme === 'dark' ? 'light' : 'dark')
})

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
  const { account, accountsForRpcUrl } = useAccountStore()
  const { sessions } = useSessionsStore()

  const prevAccounts = useRef<AccountState['accounts']>()
  // rome-ignore lint/nursery/useExhaustiveDependencies:
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
      inpageMessenger.send('accountsChanged', {
        accounts: accounts_.map((x) => x.address),
        sessions,
      })

    prevAccounts.current = accounts_
  }, [account])

  return null
}

/** Emits EIP-1193 `chainChanged` Event */
function NetworkChangedEmitter() {
  const { network } = useNetworkStore()
  const { sessions } = useSessionsStore()

  const prevNetwork = useRef<NetworkState['network']>()
  // rome-ignore lint/nursery/useExhaustiveDependencies:
  useEffect(() => {
    if (!network.chainId) return

    if (prevNetwork.current && prevNetwork.current.chainId !== network.chainId)
      inpageMessenger.send('chainChanged', {
        chainId: numberToHex(network.chainId),
        sessions,
      })

    prevNetwork.current = network
  }, [network])

  return null
}

/** Keeps block number in sync. */
function SyncBlockNumber() {
  usePendingBlock()
  return null
}

/** Keeps accounts in sync with network. */
function SyncJsonRpcAccounts() {
  const { data: chainId } = useNetworkStatus()
  const client = useClient()
  const { accountsForRpcUrl, setJsonRpcAccounts } = useAccountStore()

  // rome-ignore lint/nursery/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    ;(async () => {
      const addresses = await client.getAddresses()
      setJsonRpcAccounts({ addresses, rpcUrl: client.key })
    })()
  }, [accountsForRpcUrl, chainId, setJsonRpcAccounts, client])

  return null
}

/** Keeps network in sync (+ ensure chain id is up-to-date). */
function SyncNetwork() {
  const { data: listening } = useNetworkStatus()

  const prevListening = usePrevious(listening)
  useEffect(() => {
    // Reset blocks query when node comes back online.
    if (!prevListening && listening) {
      queryClient.resetQueries({ queryKey: ['blocks'] })
    }
  }, [prevListening, listening])

  return null
}
