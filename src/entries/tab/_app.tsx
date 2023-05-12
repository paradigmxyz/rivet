import '../../design-system/styles/global.css'
import { initializeTheme } from '../../design-system/utils/initializeTheme.ts'
import '../hmr'
import Layout from './_layout.tsx'
import DesignSystem from './ds.tsx'
import OnboardingLayout from './onboarding/_layout.tsx'
import CreateWallet from './onboarding/create-wallet.tsx'
import Index from './onboarding/index.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'

initializeTheme()

const router = createHashRouter([
  {
    path: '/ds',
    element: <DesignSystem />,
  },
  {
    path: '/onboarding',
    element: <OnboardingLayout />,
    children: [
      { path: '', element: <Index /> },
      { path: 'create-wallet', element: <CreateWallet /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </React.StrictMode>,
)
