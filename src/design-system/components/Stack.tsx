import { type ReactNode } from 'react'

import { Box } from './Box'
import type { Spacing } from '../tokens'
import { cn } from '../utils/cn'

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
      className={cn(
        'flex',
        'flex-col',
        'w-full',
        gap && `gap-${gap}`,
        alignHorizontal &&
          `items-${alignHorizontalToAlignItems[alignHorizontal]}`,
      )}
    >
      {children}
    </Box>
  )
}
