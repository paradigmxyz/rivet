import type React from 'react'
import { forwardRef, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import { TextContext } from './Text'
import type { TextStyles } from './Text.css'
import * as styles from './Text.css'

export type LinkProps = {
  align?: TextStyles['textAlign']
  children: React.ReactNode
  color?: TextStyles['color']
  size?: TextStyles['fontSize']
  style?: React.CSSProperties
  weight?: TextStyles['fontWeight']
  width?: BoxStyles['width']
  testId?: string
} & (
  | {
      external: true
      href: string
      to?: never
    }
  | {
      external?: false
      href?: never
      to?: string
    }
)

export const Link = forwardRef<HTMLDivElement, LinkProps>(
  (
    {
      align,
      children,
      color = 'text',
      external,
      href,
      size: size_,
      style,
      weight = 'regular',
      testId,
      to,
    }: LinkProps,
    ref,
  ) => {
    const { root } = useContext(TextContext)
    const inline = !root
    const size = size_ || (inline ? undefined : '15px')
    const textStyle = inline ? styles.inlineText : styles.capsizedText
    const wrap = (children: React.ReactElement) =>
      external || !to ? children : <RouterLink to={to}>{children}</RouterLink>
    return (
      <TextContext.Provider value={{ root: false }}>
        {wrap(
          <Box
            ref={ref as any}
            as={external ? 'a' : 'span'}
            className={textStyle({
              color,
              fontSize: size,
              fontWeight: weight,
              textAlign: align,
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            })}
            href={href}
            target={external ? '_blank' : undefined}
            testId={testId}
            style={style}
          >
            {children}
          </Box>,
        )}
      </TextContext.Provider>
    )
  },
)
