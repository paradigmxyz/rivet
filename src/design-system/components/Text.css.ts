import { style } from '@vanilla-extract/css'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { mapValues } from 'remeda'

import {
  backgroundColorVars,
  foregroundColorVars,
  inheritedColorVars,
} from '../styles/theme.css'
import { fontFamily, fontSize, fontWeight } from '../tokens'

const textProperties = (inline: boolean) =>
  defineProperties({
    properties: {
      color: {
        accent: `rgb(${inheritedColorVars.accent})`,
        text: `rgb(${inheritedColorVars.text})`,
        ...mapValues(backgroundColorVars, (colorVar) => `rgb(${colorVar})`),
        ...mapValues(foregroundColorVars, (colorVar) => `rgb(${colorVar})`),
      },
      fontFamily,
      fontSize: fontSize(inline),
      fontWeight,
      overflowWrap: ['anywhere', 'break-word'],
      textAlign: ['left', 'center', 'right'],
      textDecoration: ['underline'],
      textUnderlineOffset: ['2px'],
      whiteSpace: ['nowrap'],
    },
  })

export const inlineText = createSprinkles(textProperties(true))
export const capsizedText = createSprinkles(textProperties(false))
export type TextStyles = Parameters<typeof capsizedText>[0]

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
