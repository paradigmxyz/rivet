import type { ReactNode } from 'react'

import { Box } from '~/design-system/components/Box'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      backgroundColor='surface'
      borderWidth='1.5px'
      display='flex'
      padding='24px'
      style={{
        height: '100vh',
      }}
    >
      {children}
    </Box>
  )
}
