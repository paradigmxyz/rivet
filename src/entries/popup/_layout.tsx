import { Box } from '../../design-system/components/Box'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      backgroundColor="surface"
      borderWidth="1.5px"
      display="flex"
      padding="16px"
      style={{
        height: 560,
        width: 360,
      }}
    >
      {children}
    </Box>
  )
}
