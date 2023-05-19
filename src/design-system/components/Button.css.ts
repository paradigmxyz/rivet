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
  'solid primary',
  'solid body',
  'solid red',
  'solid green',
  'stroked primary',
  'stroked scrim',
  'tint red',
  'tint green',
] as const satisfies readonly `${ButtonKind} ${
  | BackgroundColor
  | ForegroundColor}`[]
export type ButtonVariant = typeof buttonVariants[number]
