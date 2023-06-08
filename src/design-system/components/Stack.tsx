import type { ReactNode } from 'react'

import type { Spacing } from '../tokens'
import { Box } from './Box'
import type { BoxStyles } from './Box.css'

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
  width?: BoxStyles['width']
}

export function Stack({
  alignHorizontal,
  children,
  gap,
  width = 'full',
}: StackProps) {
  return (
    <Box
      alignItems={
        alignHorizontal && alignHorizontalToAlignItems[alignHorizontal]
      }
      display='flex'
      flexDirection='column'
      gap={gap}
      width={width}
    >
      {children}
    </Box>
  )
}
