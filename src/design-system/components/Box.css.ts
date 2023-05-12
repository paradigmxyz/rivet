import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { mapKeys, mapValues } from 'remeda'

import {
  backgroundColorVars,
  borderColorForBackgroundColorVars,
  foregroundColorVars,
  inheritedColorVars,
  textColorForBackgroundColorVars,
} from '../styles/theme.css'
import {
  negatedSpacing,
  positionSpacing,
  radii,
  spacing,
  strokeWeights,
  viewports,
} from '../tokens'
import { createVar } from '@vanilla-extract/css'

const colorOpacities = [
  '0.02',
  '0.05',
  '0.1',
  '0.2',
  '0.3',
  '0.4',
  '0.5',
  '0.6',
  '0.7',
  '0.8',
  '0.9',
  '0.95',
  '0.98',
] as const

type ExtractKeys<T> = {
  [K in keyof T]: K extends string ? K : never
}[keyof T]

function getColorOpacityVariants<
  TVars extends Record<string, string>,
  TOpacities extends readonly `0.${number}`[],
>(vars: TVars, opacities: TOpacities) {
  return Object.entries(vars).reduce((acc, [key, value]) => {
    return {
      ...acc,
      ...Object.fromEntries(
        opacities.map((opacity) => [
          `${key} / ${opacity}`,
          `rgb(${value} / ${opacity})`,
        ]),
      ),
    }
  }, {} as any) as Record<
    `${ExtractKeys<TVars>} / ${TOpacities[number]}`,
    string
  >
}

const accentColorWithOpacities = getColorOpacityVariants(
  { accent: inheritedColorVars.accent } as const,
  colorOpacities,
)
const backgroundColorsWithOpacities = getColorOpacityVariants(
  backgroundColorVars,
  colorOpacities,
)
const borderColorsForBackgroundColorWithOpacities = getColorOpacityVariants(
  borderColorForBackgroundColorVars,
  colorOpacities,
)

export const gapVar = createVar()

const boxBaseProperties = defineProperties({
  properties: {
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    backdropFilter: ['blur(26px)'],
    borderRadius: radii,
    borderWidth: mapValues(strokeWeights, (borderWidth) => ({
      borderStyle: 'solid',
      borderWidth,
    })),
    bottom: positionSpacing,
    display: ['none', 'flex', 'block', 'inline'],
    flexDirection: ['row', 'column'],
    flexWrap: ['wrap'],
    flexBasis: ['0'],
    flexGrow: ['0', '1'],
    flexShrink: ['0', '1'],
    gap: mapValues(spacing, (gap) => ({
      gap,
      vars: { [gapVar]: gap },
    })),
    height: {
      fit: 'fit-content',
      full: '100%',
    },
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    left: spacing,
    marginBottom: { auto: 'auto', ...negatedSpacing },
    marginLeft: { auto: 'auto', ...negatedSpacing },
    marginRight: { auto: 'auto', ...negatedSpacing },
    marginTop: { auto: 'auto', ...negatedSpacing },
    maxWidth: viewports,
    opacity: ['0.1'],
    paddingBottom: spacing,
    paddingLeft: spacing,
    paddingRight: spacing,
    paddingTop: spacing,
    position: ['relative', 'absolute', 'fixed', 'sticky'],
    right: spacing,
    top: spacing,
    width: {
      fit: 'fit-content',
      full: '100%',
    },
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingHorizontal: ['paddingLeft', 'paddingRight'],
    paddingVertical: ['paddingTop', 'paddingBottom'],
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginHorizontal: ['marginLeft', 'marginRight'],
    marginVertical: ['marginTop', 'marginBottom'],
    placeItems: ['justifyContent', 'alignItems'],
  },
})

const boxColorProperties = defineProperties({
  conditions: {
    default: {},
    hover: { selector: '&:hover' },
    hoveractive: { selector: '&:hover:active' },
    hoverfocus: { selector: '&:hover:focus' },
    focus: { selector: '&:focus' },
    active: { selector: '&:active' },
    disabled: { selector: '&:disabled' },
  },
  defaultCondition: 'default',
  properties: {
    backgroundColor: {
      accent: `rgb(${inheritedColorVars.accent})`,
      ...mapValues(backgroundColorVars, (colorVar, color) => {
        const borderColorForBackgroundColor = (
          borderColorForBackgroundColorVars as any
        )[color]
        const textColorForBackgroundColor = (
          textColorForBackgroundColorVars as any
        )[color]

        return {
          backgroundColor: `rgb(${colorVar})`,
          borderColor: `rgb(${borderColorForBackgroundColor})`,
          color: `rgb(${textColorForBackgroundColor})`,
          fill: `rgb(${textColorForBackgroundColor})`,
          vars: {
            [inheritedColorVars.border]: borderColorForBackgroundColor,
            [inheritedColorVars.text]: textColorForBackgroundColor,
          },
        }
      }),
      ...accentColorWithOpacities,
      ...backgroundColorsWithOpacities,
    },
    borderColor: {
      accent: `rgb(${inheritedColorVars.accent})`,
      border: `rgb(${inheritedColorVars.border})`,
      transparent: 'transparent',
      ...mapValues(foregroundColorVars, (colorVar) => `rgb(${colorVar})`),
      ...mapValues(
        borderColorForBackgroundColorVars,
        (colorVar) => `rgb(${colorVar})`,
      ),
      ...accentColorWithOpacities,
      ...borderColorsForBackgroundColorWithOpacities,
    },
    color: {
      accent: `rgb(${inheritedColorVars.accent})`,
      text: `rgb(${inheritedColorVars.text})`,
      ...mapValues(foregroundColorVars, (colorVar) => `rgb(${colorVar})`),
      ...mapValues(
        mapKeys(backgroundColorVars, (key) => `background ${key}`),
        (colorVar) => `rgb(${colorVar})`,
      ),
      ...accentColorWithOpacities,
      ...mapKeys(backgroundColorsWithOpacities, (key) => `background ${key}`),
    },
    transform: {
      shrink: 'scale(0.98)',
    },
  },
})

export const boxStyles = createSprinkles(boxBaseProperties, boxColorProperties)
export type BoxStyles = Parameters<typeof boxStyles>[0]
