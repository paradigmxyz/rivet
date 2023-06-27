import { forwardRef } from 'react'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import type { TextStyles } from './Text.css'
import * as styles from './Text.css'

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

export const Text = forwardRef<HTMLDivElement, TextProps>(
  (
    {
      align,
      as = 'div',
      children,
      color,
      size = '15px',
      style,
      tabular = false,
      weight = 'regular',
      wrap = true,
      testId,
    }: TextProps,
    ref,
  ) => {
    return (
      <Box
        ref={ref as any}
        as={as}
        className={styles.text({
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
          className={[tabular && styles.tabular, !wrap && styles.nowrap]}
        >
          {children}
        </Box>
      </Box>
    )
  },
)
