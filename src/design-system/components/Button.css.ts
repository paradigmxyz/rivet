import { styleVariants } from '@vanilla-extract/css'

import type { BackgroundColor, ForegroundColor } from '../tokens'

const buttonHeight = {
  '36px': 36,
  '44px': 44,
} as const
export type ButtonHeight = keyof typeof buttonHeight

export const buttonHeightStyles = styleVariants(buttonHeight, (height) => [
  { height },
])

export type ButtonKind = 'solid' | 'stroked' | 'tint'

export const buttonVariants = [
  'solid surface/invert',
  'solid surface/primary',
  'solid surface/secondary/elevated',
  'solid surface/fill/tertiary',
  'solid surface/blue',
  'solid surface/red',
  'solid surface/green',
  'stroked surface/fill',
  'stroked surface/invert',
  'stroked surface/blue',
  'stroked surface/red',
  'stroked surface/green',
  'tint surface/blue',
  'tint surface/green',
  'tint surface/red',
] as const satisfies readonly `${ButtonKind} ${
  | BackgroundColor
  | ForegroundColor}`[]
export type ButtonVariant = typeof buttonVariants[number]
