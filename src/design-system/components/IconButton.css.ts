import { styleVariants } from '@vanilla-extract/css'

const iconButtonSize = {
  '20px': 20,
  '24px': 24,
  '36px': 36,
  '44px': 44,
  '100%': '100%',
} as const
export type IconButtonSize = keyof typeof iconButtonSize
export const iconButtonHeightStyles = styleVariants(iconButtonSize, (size) => [
  { height: size, width: size },
])
