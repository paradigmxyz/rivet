import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Outlet, useNavigate } from 'react-router-dom'

import { Box } from '~/design-system'
import { useNetworkStore, usePendingRequestsStore } from '~/zustand'

import { Header, NetworkOfflineDialog } from '~/components'

import { ErrorToast } from '~/components/toast/Error'
import { LoadingToast } from '~/components/toast/Loading'
import { SuccessToast } from '~/components/toast/Success'
import { useNetworkStatus } from '~/hooks/useNetworkStatus'
import { getMessenger } from '../messengers'
import PendingRequest from './pending-request'

const headerHeight = '120px'

const contentMessenger = getMessenger('wallet:contentScript')

export default function Layout() {
  const { network, onboarded } = useNetworkStore()
  const { data: online } = useNetworkStatus()
  const navigate = useNavigate()
  const { pendingRequests } = usePendingRequestsStore()
  const pendingRequest = pendingRequests[pendingRequests.length - 1]

  const showHeader = onboarded

  const isNetworkOffline = Boolean(network.rpcUrl && onboarded && !online)
  // rome-ignore lint/nursery/useExhaustiveDependencies:
  useEffect(() => {
    contentMessenger.reply('pushRoute', async (route) => {
      navigate(route)
      return
    })
  }, [])

  return (
    <Box
      backgroundColor="surface/primary/elevated"
      borderLeftWidth="1px"
      display="flex"
      flexDirection="column"
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {showHeader && (
        <Box style={{ height: headerHeight }}>
          <Header isNetworkOffline={isNetworkOffline} />
        </Box>
      )}
      <Box
        width="full"
        position="relative"
        style={{ height: showHeader ? `calc(100% - ${headerHeight})` : '100%' }}
      >
        {isNetworkOffline && <NetworkOfflineDialog />}
        {pendingRequests.length > 0 && (
          <PendingRequest request={pendingRequest} />
        )}
        <Box
          display={pendingRequests.length > 0 ? 'none' : 'block'}
          height="full"
        >
          <Outlet />
          <Toaster
            children={(toast) => {
              if (toast.type === 'success') {
                return <SuccessToast message={toast.message} />
              }

              if (toast.type === 'error') {
                return <ErrorToast message={toast.message} />
              }

              if (toast.type === 'loading') {
                return <LoadingToast message={toast.message} />
              }

              // Custom Toast does have all styles and config just rendering would do fine.
              if (toast.type === 'custom') {
                return <>{toast.message}</>
              }
              // Default for any custom toasts
              return <SuccessToast message={toast.message} />
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
