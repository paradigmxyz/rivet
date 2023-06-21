import React from 'react'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'
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
  style?: React.CSSProperties
  tabular?: boolean
  weight?: TextStyles['fontWeight']
  width?: BoxStyles['width']
  wrap?: boolean
  testId?: string
}

export function Text({
  align,
  as = 'div',
  children,
  color = 'text',
  size = '15px',
  style,
  tabular = false,
  weight = 'regular',
  wrap = true,
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
      style={style}
      width={wrap ? undefined : 'full'}
    >
      <Box
        as='span'
        style={{
          ...(tabular
            ? {
                fontVariant: 'tabular-nums',
                letterSpacing: '0px',
              }
            : {}),
          ...(wrap
            ? {}
            : {
                display: 'block',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }),
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
