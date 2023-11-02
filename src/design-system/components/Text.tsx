import useResizeObserver from '@react-hook/resize-observer'
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { truncate } from '~/utils'

import { fontAttributes } from '../tokens'
import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import { Button, type ButtonRootProps } from './Button'
import type { TextStyles } from './Text.css'
import * as styles from './Text.css'

export type TextWrapperProps = {
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
  family?: TextStyles['fontFamily']
  size?: TextStyles['fontSize']
  style?: React.CSSProperties
  weight?: TextStyles['fontWeight']
  width?: BoxStyles['width']
  wrap?: TextStyles['overflowWrap'] | false
  testId?: string
}

export const TextContext = createContext({ root: true })

export const TextWrapper = forwardRef<HTMLDivElement, TextWrapperProps>(
  (
    {
      align,
      as: as_,
      children,
      color,
      family,
      size: size_,
      style,
      weight = 'regular',
      wrap = 'break-word',
      testId,
    }: TextWrapperProps,
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
            fontFamily: family,
            fontWeight: weight,
            overflowWrap: typeof wrap === 'string' ? wrap : undefined,
            textAlign: align,
          })}
          testId={testId}
          style={style}
          width={wrap ? undefined : 'full'}
        >
          {children}
        </Box>
      </TextContext.Provider>
    )
  },
)

export type TextProps = TextWrapperProps & {
  tabular?: boolean
}

export const TextBase = forwardRef<HTMLDivElement, TextProps>(
  (
    {
      align,
      as,
      children,
      color,
      family,
      size,
      style,
      tabular = false,
      weight = 'regular',
      width,
      wrap = 'break-word',
      testId,
    }: TextProps,
    ref,
  ) => {
    return (
      <TextWrapper
        ref={ref}
        align={align}
        as={as}
        color={color}
        family={family}
        size={size}
        style={style}
        weight={weight}
        width={width}
        wrap={wrap}
        testId={testId}
      >
        <Box
          as="span"
          className={[tabular && styles.tabular, !wrap && styles.overflow]}
          display={!wrap ? 'block' : undefined}
        >
          {children || '‎'}
        </Box>
      </TextWrapper>
    )
  },
)

const heightForSize = {
  '9px': '18px',
  '11px': '18px',
  '12px': '20px',
  '14px': '24px',
  '15px': '24px',
  '16px': '24px',
  '18px': '24px',
  '20px': '24px',
  '22px': '24px',
  '26px': '36px',
  '32px': '44px',
} satisfies Record<
  Extract<TextProps['size'], string>,
  ButtonRootProps['height']
>

export type TextTruncatedProps = Omit<TextWrapperProps, 'children' | 'wrap'> & {
  children?: string | null
  end?: number
  tabular?: boolean
}

export const TextTruncated = forwardRef<HTMLDivElement, TextTruncatedProps>(
  (
    {
      align,
      children,
      color,
      family,
      size = '15px',
      style,
      tabular = false,
      weight = 'regular',
      testId,
    }: TextTruncatedProps,
    ref,
  ) => {
    const wrapperRef = useRef(null)
    const [width, setWidth] = useState<number | undefined>()

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
      setTimeout(() => setMounted(true), 16)
    }, [])

    useLayoutEffect(() => {
      setWidth(
        ((wrapperRef.current as any).getBoundingClientRect() as DOMRectReadOnly)
          .width,
      )
    }, [])
    useResizeObserver(wrapperRef, (entry) =>
      mounted ? setWidth(entry.contentRect.width) : undefined,
    )

    const truncatedText = useMemo(() => {
      const letterWidth = fontAttributes[size].letterWidth

      const width_ = width
        ? width - parseInt(heightForSize[size].replace('px', ''))
        : undefined
      return typeof width_ === 'number'
        ? truncate(children || '', {
            start: Math.floor(width_ / letterWidth) / 2 + 1,
            end: Math.floor(width_ / letterWidth) / 2 - 1,
          })
        : children
    }, [children, size, width])

    return (
      <TextWrapper
        ref={ref}
        align={align}
        color={color}
        family={family}
        size={size}
        style={{ ...style, opacity: width ? 1 : 0 }}
        weight={weight}
        testId={testId}
      >
        <Box ref={wrapperRef}>
          <Box
            as="span"
            className={[tabular && styles.tabular, styles.overflow]}
            position="relative"
          >
            {truncatedText || '‎'}
            <Box
              position="absolute"
              style={{
                right: -parseInt(heightForSize[size].replace('px', '')),
                top: -3,
                width: heightForSize[size],
              }}
            >
              <Button.Copy
                height={heightForSize[size]}
                text={children || ''}
                variant="ghost primary"
              />
            </Box>
          </Box>
        </Box>
      </TextWrapper>
    )
  },
)

export const Text = Object.assign(TextBase, {
  Truncated: TextTruncated,
})
