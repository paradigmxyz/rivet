import { foregroundColorVars } from '../design-system/styles/theme.css'
import { style } from '@vanilla-extract/css'

export const tabTrigger = style({
  transition: 'unset',
  selectors: {
    '&[data-state="active"]': {
      boxShadow: `0px -1.5px 0px rgb(${foregroundColorVars['text/primary']}) inset`,
    },
    '&[data-state="inactive"]': {
      color: `rgb(${foregroundColorVars['text/tertiary']})`,
    },
  },
})
