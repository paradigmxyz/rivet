import {
  assignVars,
  createThemeContract,
  globalStyle,
  layer,
  style,
} from '@vanilla-extract/css'
import { mapValues } from 'remeda'

import {
  backgroundColor,
  defaultInheritedColor,
  foregroundColor,
} from '../tokens'
import { toRgb } from '../utils/toRgb'

const theme = layer('theme')

export const themeClass = {
  light: '[data-theme="light"]',
  dark: '[data-theme="dark"]',
}

export const colorSchemeForThemeClass = {
  light: {
    light: 'light-light',
    dark: 'light-dark',
  },
  dark: {
    light: 'dark-light',
    dark: 'dark-dark',
  },
}

export const backgroundColorVars = createThemeContract(
  mapValues(backgroundColor, () => null),
)
export const foregroundColorVars = createThemeContract(
  mapValues(foregroundColor, () => null),
)
export const inheritedColorVars = createThemeContract({
  accent: null,
  border: null,
  text: null,
})

export const borderColorForBackgroundColorVars = createThemeContract(
  mapValues(backgroundColor, () => null),
)
export const textColorForBackgroundColorVars = createThemeContract(
  mapValues(backgroundColor, () => null),
)
export const hoverForBackgroundColorVars = createThemeContract(
  mapValues(backgroundColor, () => ({
    brightness: null,
    contrast: null,
  })),
)

globalStyle(
  [
    `:root${themeClass.light}`,
    `:root${themeClass.light} .${colorSchemeForThemeClass.light.light}`,
    `:root${themeClass.dark} .${colorSchemeForThemeClass.dark.light}`,
  ].join(', '),
  {
    '@layer': {
      [theme]: {
        colorScheme: 'light',
        vars: {
          [inheritedColorVars.border]: toRgb(
            defaultInheritedColor.border.light,
          ),
          [inheritedColorVars.text]: toRgb(defaultInheritedColor.text.light),
          ...assignVars(
            textColorForBackgroundColorVars,
            mapValues(backgroundColor, (color) =>
              toRgb(
                (color.light as { text?: string }).text ||
                  defaultInheritedColor.text.light,
              ),
            ),
          ),
        },
      },
    },
  },
)

globalStyle(
  [
    `:root${themeClass.light}`,
    `:root${themeClass.light} .${colorSchemeForThemeClass.light.light} > *`,
    `:root${themeClass.dark} .${colorSchemeForThemeClass.dark.light} > *`,
  ].join(', '),
  {
    '@layer': {
      [theme]: {
        vars: {
          [inheritedColorVars.accent]: toRgb(
            defaultInheritedColor.accent.light,
          ),
          ...assignVars(
            backgroundColorVars,
            mapValues(backgroundColor, (color) => toRgb(color.light.value)),
          ),
          ...assignVars(
            foregroundColorVars,
            mapValues(foregroundColor, (color) => toRgb(color.light)),
          ),
          ...assignVars(
            borderColorForBackgroundColorVars,
            mapValues(backgroundColor, (color) =>
              toRgb(
                (color.light as { border?: string }).border ||
                  defaultInheritedColor.border.light,
              ),
            ),
          ),
          ...assignVars(
            hoverForBackgroundColorVars,
            mapValues(backgroundColor, (color) => ({
              brightness:
                (color.light as { hover?: { brightness?: string } } | undefined)
                  ?.hover?.brightness ?? '1',
              contrast:
                (color.light as { hover?: { contrast?: string } } | undefined)
                  ?.hover?.contrast ?? '1',
            })),
          ),
        },
      },
    },
  },
)

globalStyle(
  [
    `:root${themeClass.dark}`,
    `:root${themeClass.light} .${colorSchemeForThemeClass.light.dark}`,
    `:root${themeClass.dark} .${colorSchemeForThemeClass.dark.dark}`,
  ].join(', '),
  {
    '@layer': {
      [theme]: {
        colorScheme: 'dark',
        vars: {
          [inheritedColorVars.border]: toRgb(defaultInheritedColor.border.dark),
          [inheritedColorVars.text]: toRgb(defaultInheritedColor.text.dark),
          ...assignVars(
            textColorForBackgroundColorVars,
            mapValues(backgroundColor, (color) =>
              toRgb(
                (color.dark as { text?: string }).text ||
                  defaultInheritedColor.text.dark,
              ),
            ),
          ),
        },
      },
    },
  },
)

globalStyle(
  [
    `:root${themeClass.dark}`,
    `:root${themeClass.light} .${colorSchemeForThemeClass.light.dark} > *`,
    `:root${themeClass.dark} .${colorSchemeForThemeClass.dark.dark} > *`,
  ].join(', '),
  {
    '@layer': {
      [theme]: {
        colorScheme: 'dark',
        vars: {
          [inheritedColorVars.accent]: toRgb(defaultInheritedColor.accent.dark),
          ...assignVars(
            backgroundColorVars,
            mapValues(backgroundColor, (color) => toRgb(color.dark.value)),
          ),
          ...assignVars(
            foregroundColorVars,
            mapValues(foregroundColor, (color) => toRgb(color.dark)),
          ),
          ...assignVars(
            borderColorForBackgroundColorVars,
            mapValues(backgroundColor, (color) =>
              toRgb(
                (color.dark as { border?: string }).border ||
                  defaultInheritedColor.border.dark,
              ),
            ),
          ),
          ...assignVars(
            hoverForBackgroundColorVars,
            mapValues(backgroundColor, (color) => ({
              brightness:
                (color.dark as { hover?: { brightness?: string } } | undefined)
                  ?.hover?.brightness ?? '1',
              contrast:
                (color.dark as { hover?: { contrast?: string } } | undefined)
                  ?.hover?.contrast ?? '1',
            })),
          ),
        },
      },
    },
  },
)

export const colorModeProviderStyle = style({
  backgroundColor: `rgb(${backgroundColorVars['surface/primary']})`,
  color: `rgb(${inheritedColorVars.text})`,
})
