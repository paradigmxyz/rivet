import type { ReactNode } from 'react'

import type { Spacing } from '../tokens'
import { Box } from './Box'
import type { BoxStyles } from './Box.css'

const alignHorizontalToJustifyContent = {
  center: 'center',
  justify: 'space-between',
  left: 'flex-start',
  right: 'flex-end',
} as const
type AlignHorizontal = keyof typeof alignHorizontalToJustifyContent

const alignVerticalToAlignItems = {
  bottom: 'flex-end',
  center: 'center',
  top: 'flex-start',
} as const
type AlignVertical = keyof typeof alignVerticalToAlignItems

type InlineProps = {
  alignHorizontal?: AlignHorizontal
  alignVertical?: AlignVertical
  children?: ReactNode
  gap?: Spacing
  height?: BoxStyles['height']
  wrap?: boolean
}

export function Inline({
  alignHorizontal = 'left',
  alignVertical,
  children,
  gap,
  height,
  wrap = true,
}: InlineProps) {
  return (
    <Box
      display='flex'
      flexDirection='row'
      height={height}
      alignItems={alignVertical && alignVerticalToAlignItems[alignVertical]}
      justifyContent={alignHorizontalToJustifyContent[alignHorizontal]}
      flexWrap={wrap ? 'wrap' : undefined}
      gap={gap}
    >
      {children}
    </Box>
  )
}
