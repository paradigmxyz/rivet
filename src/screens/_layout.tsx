import { Outlet } from 'react-router-dom'

import { Box, Row, Rows } from '~/design-system'
import { useNetwork, usePendingRequests } from '~/zustand'

import { Header } from '~/components'

import PendingRequest from './pending-request'

export default function Layout() {
  const { onboarded } = useNetwork()
  const { pendingRequests } = usePendingRequests()
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
            {pendingRequests.length > 0 ? (
              <PendingRequest request={pendingRequest} />
            ) : (
              <Outlet />
            )}
          </Box>
        </Row>
      </Rows>
    </Box>
  )
}
