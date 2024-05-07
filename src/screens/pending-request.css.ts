// TODO: Dedupe common styles between all of our accordions

import { globalStyle, keyframes, style } from '@vanilla-extract/css'
import { backgroundColorVars } from '~/design-system/styles/theme.css'

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

const fadeOut = keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
})

const rotateUp = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(-180deg)',
  },
})

const slideDown = keyframes({
  from: {
    height: '0px',
    opacity: 0,
  },
  to: {
    height: 'var(--radix-collapsible-content-height)',
    opacity: 1,
  },
})

const slideUp = keyframes({
  from: {
    height: 'var(--radix-collapsible-content-height)',
    opacity: 1,
  },
  to: {
    height: '0px',
    opacity: 0,
  },
})

export const item = style({
  borderBottomWidth: 1,
  borderBottomColor: `rgb(${backgroundColorVars['surface/fill']})`,
  borderBottomStyle: 'solid',
})

export const root = style({
  selectors: {
    [`${item}[data-state="open"] &`]: {
      animationName: fadeIn,
      animationDuration: '100ms',
      animationTimingFunction: 'linear',
    },
    [`${item}[data-state="closed"] &`]: {
      animationName: fadeOut,
      animationDuration: '100ms',
      animationTimingFunction: 'linear',
    },
  },
})

export const trigger = style({})

export const content = style({
  selectors: {
    '&[data-state="open"]': {
      animationName: slideDown,
      animationDuration: '100ms',
      animationTimingFunction: 'cubic-bezier(0.87, 0, 0.13, 1)',
    },
    '&[data-state="closed"]': {
      animationName: slideUp,
      animationDuration: '100ms',
      animationTimingFunction: 'cubic-bezier(0.87, 0, 0.13, 1)',
    },
  },
})

export const chevron = style({
  selectors: {
    [`${trigger}[data-state="open"] &`]: {
      animationName: rotateUp,
      animationDuration: '200ms',
      animationTimingFunction: 'ease-out',
      transform: 'rotate(-180deg)',
    },
  },
})

globalStyle(`${root} *`, {
  transition: 'opacity 0.1s',
})
