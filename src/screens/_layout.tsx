import { Outlet } from 'react-router-dom'

import { Box } from '~/design-system'
import { useNetworkStore, usePendingRequestsStore } from '~/zustand'

import { Header } from '~/components'
import { RpcDown } from '~/components/RpcDownMessage'

import PendingRequest from './pending-request'

const headerHeight = '120px'

export default function Layout() {
  const { onboarded } = useNetworkStore()
  const { pendingRequests } = usePendingRequestsStore()
  const pendingRequest = pendingRequests[pendingRequests.length - 1]

  const showHeader = onboarded

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
          <Header />
        </Box>
      )}
      <Box
        width="full"
        style={{ height: showHeader ? `calc(100% - ${headerHeight})` : '100%' }}
      >
        <RpcDown/>
        {pendingRequests.length > 0 && (
          <PendingRequest request={pendingRequest} />
        )}
        <Box
          display={pendingRequests.length > 0 ? 'none' : 'block'}
          height="full"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
