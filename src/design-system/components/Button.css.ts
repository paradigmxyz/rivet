import { styleVariants } from '@vanilla-extract/css'

export const buttonHeight = {
  '18px': 18,
  '20px': 20,
  '24px': 24,
  '36px': 36,
  '44px': 44,
} as const
export type ButtonHeight = keyof typeof buttonHeight

export const buttonHeightStyles = styleVariants(buttonHeight, (height) => [
  { height },
])

export type ButtonKind = 'ghost' | 'solid' | 'stroked' | 'tint'

export const buttonVariants = [
  'ghost primary',
  'ghost blue',
  'ghost red',
  'ghost green',
  'solid invert',
  'solid primary',
  'solid fill',
  'solid blue',
  'solid red',
  'solid green',
  'stroked fill',
  'stroked invert',
  'stroked blue',
  'stroked red',
  'stroked green',
  'tint blue',
  'tint green',
  'tint red',
] as const satisfies readonly `${ButtonKind} ${string}`[]
export type ButtonVariant = typeof buttonVariants[number]
