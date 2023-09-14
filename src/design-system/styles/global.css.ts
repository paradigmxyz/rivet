import { globalFontFace, globalStyle } from '@vanilla-extract/css'

import { fontFamily } from '../tokens'
import { backgroundColorVars } from './theme.css'

const fonts = {
  SFPro: [
    ['SFPro-Light', 300],
    ['SFPro-Regular', 400],
    ['SFPro-Medium', 500],
    ['SFPro-Semibold', 600],
    ['SFPro-Bold', 700],
    ['SFPro-Heavy', 800],
  ],
  SFMono: [
    ['SFMono-Regular', 400],
    ['SFMono-Medium', 500],
    ['SFMono-Semibold', 600],
  ],
}

Object.entries(fonts).forEach(([familyName, sets]) => {
  sets.forEach(([name, fontWeight]) => {
    globalFontFace(familyName, {
      src: `url('/fonts/${name}.woff2') format('woff2')`,
      fontWeight,
      fontStyle: 'normal',
      fontDisplay: 'auto',
    })
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

globalStyle('pre', {
  margin: 0,
})
