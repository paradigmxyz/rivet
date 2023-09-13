import { styleVariants } from '@vanilla-extract/css'

import { buttonHeight } from './Button.css'

export const widthForHeight = styleVariants(buttonHeight, (height) => [
  { width: height },
])
