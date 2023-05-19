import type { ReactNode } from 'react'

import type { Spacing } from '../tokens'
import { Box } from './Box'

const alignHorizontalToAlignItems = {
  center: 'center',
  left: 'flex-start',
  right: 'flex-end',
  stretch: 'stretch',
} as const
type AlignHorizontal = keyof typeof alignHorizontalToAlignItems

export type StackProps = {
  alignHorizontal?: AlignHorizontal
  gap?: Spacing
  children: ReactNode
}

export function Stack({ alignHorizontal, children, gap }: StackProps) {
  return (
    <Box
      alignItems={
        alignHorizontal && alignHorizontalToAlignItems[alignHorizontal]
      }
      display='flex'
      flexDirection='column'
      gap={gap}
      width='full'
    >
      {children}
    </Box>
  )
}
