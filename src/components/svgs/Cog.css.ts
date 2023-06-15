import { style } from '@vanilla-extract/css'
import { keyframes } from '@vanilla-extract/css'

const circularAnimation = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
})

const transformProperties = style({
  transformBox: 'fill-box',
  transformOrigin: 'center',
})

export const spin = style([
  transformProperties,
  {
    animationName: circularAnimation,
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
])
