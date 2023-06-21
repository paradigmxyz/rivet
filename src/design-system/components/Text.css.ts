import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { mapValues } from 'remeda'

import {
  backgroundColorVars,
  foregroundColorVars,
  inheritedColorVars,
} from '../styles/theme.css'
import { fontSize, fontWeight } from '../tokens'
import { style } from '@vanilla-extract/css'

const textProperties = defineProperties({
  properties: {
    color: {
      accent: `rgb(${inheritedColorVars.accent})`,
      text: `rgb(${inheritedColorVars.text})`,
      ...mapValues(backgroundColorVars, (colorVar) => `rgb(${colorVar})`),
      ...mapValues(foregroundColorVars, (colorVar) => `rgb(${colorVar})`),
    },
    fontSize,
    fontWeight,
    textAlign: ['left', 'center', 'right'],
    whiteSpace: ['nowrap'],
  },
})

export const text = createSprinkles(textProperties)
export type TextStyles = Parameters<typeof text>[0]

export const tabular = style({
  fontVariant: 'tabular-nums',
  letterSpacing: '0px',
})

export const nowrap = style({
  display: 'block',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})
