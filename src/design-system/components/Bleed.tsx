import { type ReactNode, forwardRef } from 'react'

import type { NegatedSpacing } from '../tokens'
import { Box } from './Box'

type BleedProps = {
  bottom?: NegatedSpacing
  children?: ReactNode
  horizontal?: NegatedSpacing
  left?: NegatedSpacing
  right?: NegatedSpacing
  space?: NegatedSpacing
  top?: NegatedSpacing
  vertical?: NegatedSpacing
}

export const Bleed = forwardRef<HTMLDivElement, BleedProps>(function Bleed(
  {
    bottom,
    children,
    horizontal,
    left,
    right,
    space,
    top,
    vertical,
  }: BleedProps,
  ref,
) {
  return (
    <Box
      ref={ref}
      marginTop={top ?? vertical ?? space}
      marginBottom={bottom ?? vertical ?? space}
      marginLeft={left ?? horizontal ?? space}
      marginRight={right ?? horizontal ?? space}
    >
      {children}
    </Box>
  )
})
