import { globalFontFace, globalStyle } from '@vanilla-extract/css'

import { fontFamily } from '../tokens'
import { backgroundColorVars } from './theme.css'
;[
  ['SFPro-Light', 300],
  ['SFPro-Regular', 400],
  ['SFPro-Medium', 500],
  ['SFPro-Semibold', 600],
  ['SFPro-Bold', 700],
  ['SFPro-Heavy', 800],
].forEach(([name, fontWeight]) => {
  globalFontFace('SFPro', {
    src: `url('/fonts/${name}.woff2') format('woff2')`,
    fontWeight,
    fontStyle: 'normal',
    fontDisplay: 'auto',
  })
})

globalStyle('html, body', {
  backgroundColor: `rgb(${backgroundColorVars['surface/primary']})`,
  fontFamily: fontFamily.default,
  fontFeatureSettings: '"rlig" 1, "calt" 1',
  fontSize: '16px',
  margin: 0,
  padding: 0,
  border: 0,
  boxSizing: 'border-box',
})

globalStyle('code', {
  fontFamily: fontFamily.mono,
})
