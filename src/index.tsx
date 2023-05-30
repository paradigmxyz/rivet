import './hmr'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import '~/design-system/styles/global.css'
import { QueryClientProvider } from '~/react-query'
import { syncStores, usePendingRequestsStore } from '~/zustand'

import Layout from './screens/_layout.tsx'
import Index from './screens/index'
import PendingRequest from './screens/pending-request.tsx'

syncStores()

const router = createHashRouter([
  {
    path: '/',
    element: <Index />,
  },
])

function App() {
  const { pendingRequests } = usePendingRequestsStore()
  const pendingRequest = pendingRequests[pendingRequests.length - 1]

  return (
    <Layout>
      {pendingRequests.length > 0 ? (
        <PendingRequest request={pendingRequest} />
      ) : (
        <RouterProvider router={router} />
      )}
    </Layout>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
