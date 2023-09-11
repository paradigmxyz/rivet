import { styleVariants } from '@vanilla-extract/css'

import { buttonHeight } from './Button.css'

export const stylesForHeight = styleVariants(buttonHeight, (height) => [
  { width: height },
])
