import * as Tabs_ from '@radix-ui/react-tabs'
import type { ReactNode } from 'react'

import { Inset } from '~/design-system'

type TabsContentProps = {
  children: ReactNode
  inset?: boolean
  value: string
}

export function TabsContent({
  children,
  inset = true,
  value,
}: TabsContentProps) {
  return (
    <Tabs_.Content asChild value={value}>
      <Inset vertical={inset ? '12px' : undefined}>{children}</Inset>
    </Tabs_.Content>
  )
}
