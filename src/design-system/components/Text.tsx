import { createContext, forwardRef, useContext } from 'react'

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

export const TextContext = createContext({ root: true })

export const Text = forwardRef<HTMLDivElement, TextProps>(
  (
    {
      align,
      as: as_,
      children,
      color,
      size: size_,
      style,
      tabular = false,
      weight = 'regular',
      wrap = true,
      testId,
    }: TextProps,
    ref,
  ) => {
    const { root } = useContext(TextContext)
    const inline = !root
    const as = as_ || (inline ? 'span' : 'div')
    const size = size_ || (inline ? undefined : '15px')
    const textStyle = inline ? styles.inlineText : styles.capsizedText
    return (
      <TextContext.Provider value={{ root: false }}>
        <Box
          ref={ref as any}
          as={as}
          className={textStyle({
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
            as="span"
            className={[tabular && styles.tabular, !wrap && styles.nowrap]}
          >
            {children}
          </Box>
        </Box>
      </TextContext.Provider>
    )
  },
)
