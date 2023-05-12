import type { ReactNode } from 'react'

import { Box } from '../../design-system/components/Box'

export default function Layout({ children }: { children: ReactNode }) {
  return <Box>{children}</Box>
}
