import './hmr'

import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { numberToHex } from 'viem'

import { getTheme, setTheme } from '~/design-system'
import '~/design-system/styles/global.css'
import { useClient } from '~/hooks/useClient'
import { getInfiniteBlocksQueryKey } from '~/hooks/useInfiniteBlocks'
import { useNetworkStatus } from '~/hooks/useNetworkStatus'
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

import TransactionDetails from './screens/TransactionDetails'
import Layout from './screens/_layout'
import AccountConfig from './screens/account-config'
import BlockConfig from './screens/block-config'
import BlockDetails from './screens/block-details'
import Index from './screens/index'
import NetworkConfig from './screens/network-config'
import OnboardingConfigure from './screens/onboarding/configure'
import OnboardingDownload from './screens/onboarding/download'
import OnboardingRun from './screens/onboarding/run'
import OnboardingStart from './screens/onboarding/start'
import Session from './screens/session'

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
        path: 'block/:blockNumber',
        element: <BlockDetails />,
      },
      {
        path: 'transaction/:transactionHash',
        element: <TransactionDetails />,
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
            path: 'configure',
            element: <OnboardingConfigure />,
          },
          {
            path: 'download',
            element: <OnboardingDownload />,
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
const backgroundMessenger = getMessenger('background:wallet')
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

const inpageMessenger = getMessenger('wallet:inpage')

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
      setJsonRpcAccounts({ addresses, rpcUrl: client.rpcUrl })
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
      queryClient.resetQueries({ queryKey: getInfiniteBlocksQueryKey() })
    }
  }, [prevListening, listening])

  return null
}
