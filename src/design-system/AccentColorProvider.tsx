import { assignInlineVars } from '@vanilla-extract/dynamic'
import chroma from 'chroma-js'
import {
  CSSProperties,
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react'

import { inheritedColorVars } from './styles/theme.css'
import { ColorScheme, defaultInheritedColor } from './tokens'
import { toRgb } from './utils/toRgb'

const AccentColorContext = createContext<{
  scheme: ColorScheme
  foregroundStyle: CSSProperties
  style: CSSProperties
}>({
  scheme: 'light',
  foregroundStyle: {},
  style: {},
})

export function AccentColorProvider({
  children,
  color,
}: {
  children: ReactNode
  color: string
}) {
  const scheme: ColorScheme = useMemo(
    () => (chroma.contrast(color, '#fff') > 2.125 ? 'dark' : 'light'),
    [color],
  )
  const foregroundStyle = useMemo(
    () => ({ color: defaultInheritedColor.accent[scheme] }),
    [scheme],
  )
  const style = useMemo(
    () => assignInlineVars({ [inheritedColorVars.accent]: toRgb(color) }),
    [color],
  )

  return (
    <AccentColorContext.Provider value={{ scheme, foregroundStyle, style }}>
      {children}
    </AccentColorContext.Provider>
  )
}

export function useAccentColor() {
  return useContext(AccentColorContext)
}
