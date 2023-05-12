import type * as Polymorphic from '@radix-ui/react-polymorphic'
import clsx, { ClassValue } from 'clsx'
import { forwardRef, useMemo } from 'react'

import { useAccentColor } from '../AccentColorProvider'
import { ColorSchemeProvider, useColorScheme } from '../ColorSchemeProvider'
import { resetBase, resetElements } from '../styles/reset.css'
import { colorSchemeForThemeClass } from '../styles/theme.css'
import { BackgroundColor, backgroundColor as backgroundColors } from '../tokens'
import { BoxStyles, boxStyles } from './Box.css'

type PolymorphicBox = Polymorphic.ForwardRefComponent<
  'div',
  BoxStyles & {
    className?: ClassValue
    testId?: string
  }
>

/**
 * Box is a low-level primitive that should only be used when building design system components,
 * or when other layout primitives (such as: Rows, Inline, Columns, etc) are not sufficient.
 */
export const Box = forwardRef(
  ({ as: Component = 'div', className, testId, ...props }, ref) => {
    const boxStyleProps: Record<string, unknown> = {}
    const restProps: Record<string, unknown> = {}

    for (const key in props) {
      if (boxStyles.properties.has(key as keyof BoxStyles)) {
        boxStyleProps[key] = props[key as keyof typeof props]
      } else {
        restProps[key] = props[key as keyof typeof props]
      }
    }

    const backgroundColor =
      typeof props.backgroundColor === 'string'
        ? props.backgroundColor
        : props.backgroundColor?.default
    const baseBackgroundColor = backgroundColor?.split(
      ' / ',
    )[0] as BackgroundColor

    const {
      scheme: accentColorScheme,
      foregroundStyle: accentForegroundStyle,
      style: accentColorStyle,
    } = useAccentColor()
    const currentColorScheme = useColorScheme()
    const colorSchemeClasses = useMemo(() => {
      if (!backgroundColor) return []

      const lightColorScheme =
        backgroundColor === 'accent'
          ? accentColorScheme
          : backgroundColors[baseBackgroundColor][currentColorScheme.light]
              .scheme
      const darkColorScheme =
        backgroundColor === 'accent'
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
        ref={ref}
        className={clsx(
          resetBase,
          typeof Component === 'string'
            ? resetElements[Component as keyof typeof resetElements]
            : undefined,
          colorSchemeClasses,
          boxStyles(boxStyleProps),
          className,
        )}
        data-testid={testId}
        style={{
          ...accentColorStyle,
          ...(backgroundColor === 'accent' && accentForegroundStyle),
        }}
        {...restProps}
      />
    )

    return backgroundColor ? (
      <ColorSchemeProvider color={baseBackgroundColor}>
        {el}
      </ColorSchemeProvider>
    ) : (
      el
    )
  },
) as PolymorphicBox

Box.displayName = 'Box'
