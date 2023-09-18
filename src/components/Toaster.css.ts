import { globalStyle } from '@vanilla-extract/css'

import {
  backgroundColorVars,
  foregroundColorVars,
  textColorForBackgroundColorVars,
} from '~/design-system/styles/theme.css'
import { fontFamily, fontSize, fontWeight } from '~/design-system/tokens'

globalStyle(':root [data-sonner-toaster]', {
  fontFamily: fontFamily.default,
  vars: {
    '--border-radius': '0',
    '--initial-height': '60px',
    '--normal-bg': `rgb(${backgroundColorVars['surface/secondary/elevated']})`,
    '--normal-border': `rgb(${backgroundColorVars['surface/fill']})`,
    '--normal-text': `rgb(${foregroundColorVars['text/primary']})`,
    '--success-bg': `rgb(${backgroundColorVars['surface/greenTint']})`,
    '--success-border': `rgb(${backgroundColorVars['surface/greenTint']})`,
    '--success-text': `rgb(${textColorForBackgroundColorVars['surface/greenTint']})`,
    '--error-bg': `rgb(${backgroundColorVars['surface/redTint']})`,
    '--error-border': `rgb(${backgroundColorVars['surface/redTint']})`,
    '--error-text': `rgb(${textColorForBackgroundColorVars['surface/redTint']})`,
  },
})

globalStyle(':root [data-sonner-toaster] [data-styled=true]', {
  padding: '8px',
})

globalStyle(':root [data-sonner-toaster] [data-title]', {
  fontWeight: fontWeight.regular,
  ...fontSize(true)['12px'],
})

globalStyle(':root [data-sonner-toaster] [data-icon]', {
  display: 'none',
})
