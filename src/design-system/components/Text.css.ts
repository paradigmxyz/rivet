import { createStyleObject as capsize } from '@capsizecss/core'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { mapValues } from 'remeda'

import {
  backgroundColorVars,
  foregroundColorVars,
  inheritedColorVars,
} from '../styles/theme.css'
import { fontWeight } from '../tokens'

const fontMetrics = {
  capHeight: 1443,
  ascent: 1950,
  descent: -494,
  lineGap: 0,
  unitsPerEm: 2048,
}

function defineType(
  fontSize: number,
  lineHeight: number | `${number}%`,
  letterSpacing: number,
) {
  const leading =
    typeof lineHeight === 'number'
      ? lineHeight
      : (fontSize * parseInt(lineHeight)) / 100

  return {
    ...capsize({ fontMetrics, fontSize, leading }),
    letterSpacing,
  }
}

const textProperties = defineProperties({
  properties: {
    color: {
      accent: `rgb(${inheritedColorVars.accent})`,
      text: `rgb(${inheritedColorVars.text})`,
      ...mapValues(backgroundColorVars, (colorVar) => `rgb(${colorVar})`),
      ...mapValues(foregroundColorVars, (colorVar) => `rgb(${colorVar})`),
    },
    fontSize: {
      '9px': defineType(9, 11, 0.56),
      '11px': defineType(11, 13, 0.56),
      '12px': defineType(12, 15, 0.52),
      '14px': defineType(14, 19, 0.48),
      '15px': defineType(15, 21, 0.35),
      '16px': defineType(16, 21, 0.35),
      '18px': defineType(18, 23, 0.36),
      '20px': defineType(20, 25, 0.36),
      '22px': defineType(22, 29, 0.35),
      '26px': defineType(26, 32, 0.36),
      '32px': defineType(32, 40, 0.41),
    },
    fontWeight,
    textAlign: ['left', 'center', 'right'],
    whiteSpace: ['nowrap'],
  },
})

export const textStyles = createSprinkles(textProperties)
export type TextStyles = Parameters<typeof textStyles>[0]
