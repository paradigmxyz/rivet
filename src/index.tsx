import './hmr'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'

import '~/design-system/styles/global.css'
import { QueryClientProvider } from '~/react-query'
import { syncStores } from '~/zustand'

import Layout from './screens/_layout.tsx'
import Index from './screens/index'
import NetworkConfig from './screens/network-config.tsx'

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
        path: 'network-config',
        element: <NetworkConfig />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
