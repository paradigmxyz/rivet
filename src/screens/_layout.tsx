import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Header, NetworkOfflineDialog, Toaster } from '~/components'
import { Box } from '~/design-system'
import { useNetworkStatus } from '~/hooks/useNetworkStatus'
import { useNetworkStore, usePendingRequestsStore } from '~/zustand'
import { getMessenger } from '../messengers'
import PendingRequest from './pending-request'

const headerHeight = '120px'
const networkOfflineBypassPaths = ['networks', 'session']

const contentMessenger = getMessenger('wallet:contentScript')

export default function Layout() {
  const { network, onboarded } = useNetworkStore()
  const location = useLocation()
  const { data: online } = useNetworkStatus({ rpcUrl: network.rpcUrl })
  const navigate = useNavigate()
  const { pendingRequests } = usePendingRequestsStore()
  const pendingRequest = pendingRequests[pendingRequests.length - 1]

  const showHeader = onboarded

  const isNetworkOffline = Boolean(network.rpcUrl && onboarded && !online)
  useEffect(() => {
    contentMessenger.reply('pushRoute', async (route) => {
      navigate(route)
      return
    })
  }, [])

  const showNetworkOfflineDialog =
    isNetworkOffline &&
    !networkOfflineBypassPaths.some((path) => location.pathname.includes(path))

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
      <Toaster />
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
        {showNetworkOfflineDialog && <NetworkOfflineDialog />}
        {pendingRequests.length > 0 && (
          <PendingRequest request={pendingRequest} />
        )}
        <Box height="full">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
