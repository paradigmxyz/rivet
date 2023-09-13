import * as Tabs_ from '@radix-ui/react-tabs'
import type { ReactNode } from 'react'

import { Box } from '~/design-system'

type TabsContentProps = {
  children: ReactNode
  inset?: boolean
  scrollable?: boolean
  value: string
}

export function TabsContent({
  children,
  inset = true,
  scrollable = true,
  value,
}: TabsContentProps) {
  return (
    <Tabs_.Content asChild value={value}>
      <Box
        height="full"
        marginHorizontal="-8px"
        style={{ overflowY: scrollable ? 'scroll' : 'auto' }}
      >
        <Box
          height="full"
          paddingHorizontal="8px"
          paddingVertical={inset ? '8px' : undefined}
        >
          {children}
        </Box>
      </Box>
    </Tabs_.Content>
  )
}
