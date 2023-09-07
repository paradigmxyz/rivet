import { style } from '@vanilla-extract/css'

export const content = style({
  selectors: {
    '&:focus': {
      outline: 'unset',
    },
  },
})
