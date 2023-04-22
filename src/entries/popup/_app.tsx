import '../styles.css'
import '../hmr'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './_layout.tsx'
import Index from './index.tsx'
import CreateWallet from './create-wallet.tsx'

const router = createHashRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/create-wallet',
    element: <CreateWallet />,
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Layout>
      <RouterProvider router={router}/>
    </Layout>
  </React.StrictMode>,
)
