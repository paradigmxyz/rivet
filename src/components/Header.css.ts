import { foregroundColorVars } from '../design-system/styles/theme.css'
import { style } from '@vanilla-extract/css'
import { keyframes } from '@vanilla-extract/css'

const mineAnimation = keyframes({
  '0%': {
    color: 'white',
    transform: 'rotate(0deg)',
  },
  '50%': {
    color: 'white',
    transform: 'rotate(10deg)',
  },
  '100%': {
    color: `rgb(${foregroundColorVars['text/tertiary']})`,
    transform: 'rotate(0deg)',
  },
})

export const mineSymbol = style({
  animationName: mineAnimation,
  animationDuration: '0.2s',
  animationTimingFunction: 'linear',
})
