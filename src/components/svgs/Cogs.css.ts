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

const floatAnimation = keyframes({
  '0%': {
    transform: 'rotate(0deg) translateX(1px) rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg) translateX(1px) rotate(-360deg)',
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
    animationDuration: '30s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
])

export const float = style([
  transformProperties,
  {
    animationName: floatAnimation,
    animationDuration: '5s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
])
