import type * as Polymorphic from '@radix-ui/react-polymorphic'
import clsx, { type ClassValue } from 'clsx'
import { forwardRef, useMemo } from 'react'

import { useAccentColor } from '../AccentColorProvider'
import { ColorSchemeProvider, useColorScheme } from '../ColorSchemeProvider'
import { resetBase, resetElements } from '../styles/reset.css'
import { colorSchemeForThemeClass } from '../styles/theme.css'
import {
  type BackgroundColor,
  backgroundColor as backgroundColors,
} from '../tokens'
import { type BoxStyles } from './Box.css'
import * as styles from './Box.css'

type PolymorphicBox = Polymorphic.ForwardRefComponent<
  'div',
  BoxStyles & {
    className?: ClassValue
    hoverable?: boolean
    testId?: string
  }
>

/**
 * Box is a low-level primitive that should only be used when building design system components,
 * or when other layout primitives (such as: Rows, Inline, Columns, etc) are not sufficient.
 */
export const Box = forwardRef(
  (
    { as: Component = 'div', className, hoverable, style, testId, ...props },
    ref,
  ) => {
    const boxStyleProps: Record<string, unknown> = {}
    const restProps: Record<string, unknown> = {}

    for (const key in props) {
      if (styles.box.properties.has(key as keyof BoxStyles)) {
        boxStyleProps[key] = props[key as keyof typeof props]
      } else {
        restProps[key] = props[key as keyof typeof props]
      }
    }
    if (hoverable) boxStyleProps.hover = 'translucent'

    const backgroundColor =
      typeof props.backgroundColor === 'string'
        ? props.backgroundColor
        : props.backgroundColor?.default
    const [baseBackgroundColor, opacity] = (backgroundColor || '').split(
      '@',
    ) as [BackgroundColor, string]
    const applyColorScheme =
      (backgroundColor === 'accent' || backgroundColors[baseBackgroundColor]) &&
      (!opacity || parseFloat(opacity) > 0.5)

    const {
      scheme: accentColorScheme,
      foregroundStyle: accentForegroundStyle,
      style: accentColorStyle,
    } = useAccentColor()
    const currentColorScheme = useColorScheme()
    const colorSchemeClasses = useMemo(() => {
      if (!backgroundColor) return []

      const lightColorScheme =
        backgroundColor === 'accent' || !backgroundColors[baseBackgroundColor]
          ? accentColorScheme
          : backgroundColors[baseBackgroundColor][currentColorScheme.light]
              .scheme
      const darkColorScheme =
        backgroundColor === 'accent' || !backgroundColors[baseBackgroundColor]
          ? accentColorScheme
          : backgroundColors[baseBackgroundColor][currentColorScheme.dark]
              .scheme

      return [
        lightColorScheme === 'light'
          ? colorSchemeForThemeClass.light.light
          : colorSchemeForThemeClass.light.dark,
        darkColorScheme === 'light'
          ? colorSchemeForThemeClass.dark.light
          : colorSchemeForThemeClass.dark.dark,
      ]
    }, [
      accentColorScheme,
      baseBackgroundColor,
      backgroundColor,
      currentColorScheme,
    ])

    const el = (
      <Component
        {...restProps}
        ref={ref}
        className={clsx(
          resetBase,
          typeof Component === 'string'
            ? resetElements[Component as keyof typeof resetElements]
            : undefined,
          applyColorScheme && colorSchemeClasses,
          styles.box(boxStyleProps),
          className,
        )}
        data-testid={testId}
        style={{
          ...accentColorStyle,
          ...(backgroundColor === 'accent' && accentForegroundStyle),
          ...(style || {}),
        }}
      />
    )

    return backgroundColor && applyColorScheme ? (
      <ColorSchemeProvider color={baseBackgroundColor}>
        {el}
      </ColorSchemeProvider>
    ) : (
      el
    )
  },
) as PolymorphicBox

Box.displayName = 'Box'
