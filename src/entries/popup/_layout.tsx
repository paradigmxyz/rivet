
import type { ReactNode } from 'react'
import { Box } from '../../design-system/components/Box'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      className={[
        'border-neutral-700',
        'border-[1px]',
        'bg-surface',
        'flex',
        'h-[560px]',
        'w-[360px]',
        'p-16px',
      ]}
    >
      {children}
    </Box>
  )
}
