import { type ReactNode, createContext, useContext, useMemo } from 'react'

import { useAccentColor } from './AccentColorProvider'
import {
  type BackgroundColor,
  type ColorScheme,
  backgroundColor,
} from './tokens'

type ColorSchemeProviderProps = {
  color: 'accent' | BackgroundColor
  children: ReactNode
}

export const ColorSchemeContext = createContext<{
  light: ColorScheme
  dark: ColorScheme
}>({
  light: 'light',
  dark: 'dark',
})

export function ColorSchemeProvider({
  color,
  children,
}: ColorSchemeProviderProps) {
  const { scheme } = useAccentColor()
  const parentScheme = useColorScheme()

  const lightScheme =
    color === 'accent'
      ? scheme
      : backgroundColor[color][parentScheme.light].scheme

  const darkScheme =
    color === 'accent'
      ? scheme
      : backgroundColor[color][parentScheme.dark].scheme

  const value = useMemo(
    () => ({ light: lightScheme, dark: darkScheme }),
    [darkScheme, lightScheme],
  )

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  )
}

export function useColorScheme() {
  return useContext(ColorSchemeContext)
}
