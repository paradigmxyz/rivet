import { Outlet } from 'react-router-dom'

import { Box, Row, Rows } from '~/design-system'
import { useNetworkStore, usePendingRequestsStore } from '~/zustand'

import { Header } from '~/components'

import PendingRequest from './pending-request'

export default function Layout() {
  const { onboarded } = useNetworkStore()
  const { pendingRequests } = usePendingRequestsStore()
  const pendingRequest = pendingRequests[pendingRequests.length - 1]

  return (
    <Box
      backgroundColor='surface/primary/elevated'
      borderLeftWidth='1px'
      display='flex'
      style={{
        height: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Rows>
        {onboarded && (
          <Row height='content'>
            <Header />
          </Row>
        )}
        <Row>
          <Box style={{ overflowY: 'scroll' }} width='full'>
            {pendingRequests.length > 0 && (
              <PendingRequest request={pendingRequest} />
            )}
            <Box
              display={pendingRequests.length > 0 ? 'none' : 'block'}
              height='full'
            >
              <Outlet />
            </Box>
          </Box>
        </Row>
      </Rows>
    </Box>
  )
}
