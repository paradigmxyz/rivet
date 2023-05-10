import { Box } from '../../design-system/components/Box'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <Box>{children}</Box>
}
