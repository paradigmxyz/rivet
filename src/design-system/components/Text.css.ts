import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { mapValues } from 'remeda'

import {
  backgroundColorVars,
  foregroundColorVars,
  inheritedColorVars,
} from '../styles/theme.css'
import { fontSize, fontWeight } from '../tokens'

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

export const textStyles = createSprinkles(textProperties)
export type TextStyles = Parameters<typeof textStyles>[0]
