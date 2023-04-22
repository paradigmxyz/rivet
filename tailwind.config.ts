import type { Config } from 'tailwindcss'
import chroma from 'chroma-js'

import {
  animation,
  borderRadius,
  backgroundColor,
  foregroundColor,
  fontSize,
  fontWeight,
  keyframes,
  spacing,
  textAlignment,
} from './src/design-system/tokens'
import type { KeyValuePair, PluginAPI } from 'tailwindcss/types/config'

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/entries/popup/_app.html', './src/**/*.{tsx,html}', './dist/src/popup/_app.html'],
  theme: {
    borderRadius,
    // @ts-expect-error
    fontSize,
    fontWeight,
    spacing,
    extend: {
      animation,
      backgroundColor,
      colors: foregroundColor,
      keyframes,
    },
  },
  plugins: [require('tailwindcss-animate'), createVars],
  safelist: [
    { pattern: /^h-/ },
    { pattern: /^w-/ },
    { pattern: /^items-/ },
    ...Object.keys(backgroundColor).flatMap((color) => [
      `bg-${color}`,
      `hover:bg-${color}/90`,
      `active:bg-${color}/80`,
      `hover:bg-${color}/[0.05]`,
      `active:bg-${color}/[0.02]`,
    ]),
    ...Object.keys(backgroundColor).map((color) => `border-${color}`),
    ...Object.keys(foregroundColor).map((color) => `border-${color}`),
    ...Object.keys(fontSize).map((size) => `text-${size}`),
    ...Object.keys(fontSize).map((size) => `h-[theme(fontSize.${size})]`),
    ...Object.keys(fontSize).map((size) => `w-[theme(fontSize.${size})]`),
    ...Object.keys(fontWeight).map((weight) => `font-${weight}`),
    ...Object.keys(foregroundColor).map((color) => `text-${color}`),
    ...Object.keys(spacing).map((space) => `gap-${space}`),
    ...textAlignment.map((align) => `text-${align}`),
  ],
} satisfies Config

function createVars({ addBase, theme }: PluginAPI) {
  const extractVars = (
    values: KeyValuePair,
    prefix: string,
    fn: (key: string, value: string) => string = (_key, value) => value,
    group = '',
  ): KeyValuePair =>
    Object.keys(values).reduce((vars: KeyValuePair, key: string) => {
      const value = values[key]

      const newVars =
        typeof value === 'string'
          ? {
              [`--${prefix}${group}-${key}`]: fn(key, value),
            }
          : extractVars(value, prefix, fn, `-${key}`)

      return { ...vars, ...newVars }
    }, {})

  addBase({
    ':root': extractVars(theme('colors'), 'color', (_key, value) =>
      value.startsWith('#') ? chroma(value).rgb().join(' ') : value,
    ),
  })
}
