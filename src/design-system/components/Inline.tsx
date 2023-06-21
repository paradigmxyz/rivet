import { type ReactNode, forwardRef } from 'react'

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

export const Inline = forwardRef<HTMLDivElement, InlineProps>(
  (
    {
      alignHorizontal = 'left',
      alignVertical,
      children,
      gap,
      height,
      wrap = true,
    },
    ref,
  ) => {
    return (
      <Box
        ref={ref}
        display='flex'
        flexDirection='row'
        flexGrow='1'
        height={height}
        alignItems={alignVertical && alignVerticalToAlignItems[alignVertical]}
        justifyContent={alignHorizontalToJustifyContent[alignHorizontal]}
        flexWrap={wrap ? 'wrap' : undefined}
        gap={gap}
      >
        {children}
      </Box>
    )
  },
)
