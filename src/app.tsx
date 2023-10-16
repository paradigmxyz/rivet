import './hmr'

import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createHashRouter,
  createMemoryRouter,
} from 'react-router-dom'
import { numberToHex } from 'viem'

import { getTheme, setTheme } from '~/design-system'
import '~/design-system/styles/global.css'
import { useClient } from '~/hooks/useClient'
import { useNetworkStatus } from '~/hooks/useNetworkStatus'
import {
  getPendingBlockQueryKey,
  usePendingBlock,
} from '~/hooks/usePendingBlock'
import { getPendingTransactionsQueryKey } from '~/hooks/usePendingTransactions'
import { usePrevious } from '~/hooks/usePrevious'
import { getTxpoolQueryKey } from '~/hooks/useTxpool'
import { getMessenger } from '~/messengers'
import { QueryClientProvider, queryClient } from '~/react-query'
import { deepEqual } from '~/utils'
import { getClient } from '~/viem'
import {
  type AccountState,
  type NetworkState,
  networkStore,
  syncStores,
  useAccountStore,
  useNetworkStore,
  useSessionsStore,
} from '~/zustand'

import { type AppMeta, AppMetaContext } from './contexts'
import Layout from './screens/_layout'
import AccountDetails from './screens/account-details'
import BlockConfig from './screens/block-config'
import BlockDetails from './screens/block-details'
import Index from './screens/index'
import NetworkConfig from './screens/network-config'
import Networks from './screens/networks'
import OnboardingConfigure from './screens/onboarding/configure'
import OnboardingDownload from './screens/onboarding/download'
import OnboardingRun from './screens/onboarding/run'
import OnboardingStart from './screens/onboarding/start'
import Session from './screens/session'
import Settings from './screens/settings'
import TransactionDetails from './screens/transaction-details'

export function init({ type = 'standalone' }: { type?: AppMeta['type'] } = {}) {
  syncStores()

  const createRouter = (() => {
    if (type === 'embedded') return createMemoryRouter
    return createHashRouter
  })()

  const router = createRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '',
          element: <Index />,
        },
        {
          path: 'account/:address',
          element: <AccountDetails />,
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
          path: 'networks',
          element: <Networks />,
        },
        {
          path: 'networks/:rpcUrl',
          element: <NetworkConfig />,
        },
        {
          path: 'session',
          element: <Session />,
        },
        {
          path: 'settings',
          element: <Settings />,
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

  const backgroundMessenger = getMessenger('background:wallet')

  // Handle requests from background to toggle the theme.
  backgroundMessenger.reply('toggleTheme', async () => {
    const { storageTheme, systemTheme } = getTheme()
    const theme = storageTheme || systemTheme
    setTheme(theme === 'dark' ? 'light' : 'dark')
  })

  // Handle executed transactions to invalidate stale queries.
  backgroundMessenger.reply('transactionExecuted', async () => {
    const {
      network: { rpcUrl },
    } = networkStore.getState()
    const client = getClient({ rpcUrl })

    queryClient.invalidateQueries({
      queryKey: getPendingBlockQueryKey([client.key]),
    })
    queryClient.invalidateQueries({
      queryKey: getPendingTransactionsQueryKey([client.key]),
    })
    queryClient.invalidateQueries({
      queryKey: getTxpoolQueryKey([client.key]),
    })
  })

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <AppMetaContext.Provider value={{ type }}>
      <QueryClientProvider>
        <AccountsChangedEmitter />
        <NetworkChangedEmitter />
        <SyncBlockNumber />
        <SyncJsonRpcAccounts />
        <SyncNetwork />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppMetaContext.Provider>,
  )
}

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
  const client = useClient()
  const { data: listening } = useNetworkStatus()

  const prevListening = usePrevious(listening)
  useEffect(() => {
    // Reset stale queries that are dependent on the client when node comes back online.
    if (prevListening === false && listening) {
      queryClient.removeQueries({
        predicate(query) {
          return query.queryKey.includes(client.key)
        },
      })
    }
  }, [prevListening, listening, client.key])

  return null
}
