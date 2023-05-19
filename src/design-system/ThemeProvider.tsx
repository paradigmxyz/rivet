import { type ReactNode, useMemo } from 'react'

import { ColorSchemeContext } from './ColorSchemeProvider'
import {
  colorModeProviderStyle,
  colorSchemeForThemeClass,
} from './styles/theme.css'
import type { Theme } from './tokens'

interface ThemeProviderProps {
  children: ReactNode | ((args: { className: string }) => ReactNode)
  theme: Theme
}

const colorSchemeForTheme = {
  light: 'light',
  dark: 'dark',
} as const

const schemeClasses = {
  light: `${colorSchemeForThemeClass.light.light} ${colorSchemeForThemeClass.dark.light}`,
  dark: `${colorSchemeForThemeClass.light.dark} ${colorSchemeForThemeClass.dark.dark}`,
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const colorScheme = colorSchemeForTheme[theme]
  const className = schemeClasses[colorScheme]

  return (
    <ColorSchemeContext.Provider
      value={useMemo(
        () => ({
          light: colorScheme,
          dark: colorScheme,
        }),
        [colorScheme],
      )}
    >
      {typeof children === 'function' ? (
        children({ className })
      ) : (
        <div className={className}>
          <div className={colorModeProviderStyle}>{children}</div>
        </div>
      )}
    </ColorSchemeContext.Provider>
  )
}
