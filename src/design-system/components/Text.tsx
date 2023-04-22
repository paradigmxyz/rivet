import React from 'react'

import { Box } from './Box'
import type { FontSize, FontWeight, ForegroundColor } from '../tokens'
import { cn } from '../utils/cn'

export type TextProps = {
  align?: 'left' | 'center' | 'right'
  as?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: React.ReactNode
  color?: ForegroundColor
  size?: FontSize
  weight?: FontWeight
  testId?: string
}

export function Text({
  align,
  as = 'div',
  children,
  color = 'label',
  size = '16px',
  weight = 'light',
  testId,
}: TextProps) {
  return (
    <Box
      as={as}
      className={cn(
        align && `text-${align}`,
        `text-${color}`,
        `text-${size}`,
        `font-${weight}`,
      )}
      testId={testId}
    >
      {children}
    </Box>
  )
}
