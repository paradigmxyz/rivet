import { style, styleVariants } from '@vanilla-extract/css'

import { backgroundColorVars, inheritedColorVars } from '../styles/theme.css'

export const backgroundStyle = style({
  transition: 'border-color 100ms ease',
})

export const inputHeights = {
  '24px': 24,
  '36px': 36,
} as const
export type InputHeight = keyof typeof inputHeights

export type InputState = 'warning' | 'error'

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
    color: `rgb(${inheritedColorVars.text} / 0.4)`,
  },
})

export const invalidStyle = style({
  selectors: {
    '&[data-invalid="true"]': {
      borderColor: `rgb(${backgroundColorVars['surface/red']})`,
    },
  },
})
