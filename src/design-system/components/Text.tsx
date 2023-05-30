import React from 'react'

import { Box } from './Box'
import { type TextStyles, textStyles } from './Text.css'

export type TextProps = {
  align?: TextStyles['textAlign']
  as?:
    | 'div'
    | 'p'
    | 'span'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'code'
    | 'pre'
  children: React.ReactNode
  color?: TextStyles['color']
  size?: TextStyles['fontSize']
  weight?: TextStyles['fontWeight']
  testId?: string
}

export function Text({
  align,
  as = 'div',
  children,
  color = 'text',
  size = '15px',
  weight = 'regular',
  testId,
}: TextProps) {
  return (
    <Box
      as={as}
      className={textStyles({
        color,
        fontSize: size,
        fontWeight: weight,
        textAlign: align,
      })}
      testId={testId}
    >
      {children}
    </Box>
  )
}
