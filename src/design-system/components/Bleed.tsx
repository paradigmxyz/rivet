import type { ReactNode } from 'react'

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

export function Bleed({
  bottom,
  children,
  horizontal,
  left,
  right,
  space,
  top,
  vertical,
}: BleedProps) {
  return (
    <Box
      marginTop={top ?? vertical ?? space}
      marginBottom={bottom ?? vertical ?? space}
      marginLeft={left ?? horizontal ?? space}
      marginRight={right ?? horizontal ?? space}
    >
      {children}
    </Box>
  )
}
