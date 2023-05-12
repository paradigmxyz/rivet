import { style, styleVariants } from '@vanilla-extract/css'

import { inheritedColorVars } from '../styles/theme.css'

export const backgroundStyle = style({
  transition: 'border-color 100ms ease',
})

export const inputHeights = {
  '36px': 36,
} as const
export type InputHeight = keyof typeof inputHeights

export type InputKind = 'solid'
export const inputVariants = [
  'solid',
] as const satisfies readonly `${InputKind}`[]
export type InputVariant = typeof inputVariants[number]

export const heightStyles = styleVariants(inputHeights, (height) => [
  { height },
])

export const placeholderStyle = style({
  '::placeholder': {
    color: `rgb(${inheritedColorVars.text} / 0.2)`,
  },
})
