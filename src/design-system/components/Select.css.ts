import { style, styleVariants } from '@vanilla-extract/css'

import { backgroundColorVars } from '../styles/theme.css'

export const backgroundStyle = style({
  transition: 'border-color 100ms ease',
})

export const selectHeights = {
  '24px': 24,
  '36px': 36,
} as const
export type SelectHeight = keyof typeof selectHeights

export type SelectKind = 'solid'
export const selectVariants = [
  'solid',
] as const satisfies readonly `${SelectKind}`[]
export type SelectVariant = (typeof selectVariants)[number]

export const heightStyles = styleVariants(selectHeights, (height) => [
  { height },
])

export const disabledStyle = style({
  selectors: {
    '&[disabled]': {
      pointerEvents: 'none',
    },
  },
})

export const invalidStyle = style({
  selectors: {
    '&[data-invalid="true"]': {
      borderColor: `rgb(${backgroundColorVars['surface/red']})`,
    },
  },
})
