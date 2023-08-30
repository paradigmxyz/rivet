import { style } from '@vanilla-extract/css'
import { keyframes } from '@vanilla-extract/css'

import { backgroundColorVars } from '../design-system/styles/theme.css'

const mineAnimation = keyframes({
  '0%': {
    backgroundColor: `rgb(${backgroundColorVars['surface/fill/secondary']})`,
  },
  '100%': {
    backgroundColor: 'transparent',
  },
})

export const mineBackground = style({
  animationName: mineAnimation,
  animationDuration: '0.5s',
  animationTimingFunction: 'linear',
})
