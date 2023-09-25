import { createStyleObject as capsize } from '@capsizecss/core'
import type { CapsizeOptions } from '@capsizecss/core/dist/declarations/src/types'

export type Theme = 'light' | 'dark'
export type ColorScheme = 'light' | 'dark'

export type BackgroundColorValue = Record<
  Theme,
  {
    value: string
    scheme: ColorScheme
    border?: string
    text?: string
    hover?: {
      brightness?: string
      contrast?: string
    }
  }
>
export const backgroundColor = {
  'surface/primary': {
    light: {
      value: '#f5f5f5',
      scheme: 'light',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: '#000000',
      scheme: 'dark',
      hover: {
        contrast: '0.85',
      },
    },
  },
  'surface/primary/elevated': {
    light: {
      value: '#FFFFFF',
      scheme: 'light',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: '#191A1C',
      scheme: 'dark',
      hover: {
        contrast: '0.95',
      },
    },
  },
  'surface/secondary': {
    light: {
      value: '#F0F1F5',
      scheme: 'light',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: '#1B1C1E',
      scheme: 'dark',
      hover: {
        contrast: '0.85',
      },
    },
  },
  'surface/secondary/elevated': {
    light: {
      value: '#FFFFFF',
      scheme: 'light',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: '#222324',
      scheme: 'dark',
      hover: {
        contrast: '0.85',
      },
    },
  },
  'surface/fill': {
    light: {
      value: '#D9DBDF',
      scheme: 'light',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: '#44474B',
      scheme: 'dark',
      hover: {
        contrast: '0.85',
      },
    },
  },
  'surface/fill/secondary': {
    light: {
      value: '#E4E6EA',
      scheme: 'light',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: '#3E3F43',
      scheme: 'dark',
      hover: {
        contrast: '0.85',
      },
    },
  },
  'surface/fill/tertiary': {
    light: {
      value: '#ececec',
      scheme: 'light',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: '#2e2f30',
      scheme: 'dark',
      hover: {
        contrast: '0.95',
      },
    },
  },
  'surface/fill/quarternary': {
    light: {
      value: '#f9f9f9',
      scheme: 'light',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: '#212224',
      scheme: 'dark',
      hover: {
        contrast: '0.95',
      },
    },
  },
  'surface/blue': {
    light: {
      value: '#3374F4',
      scheme: 'dark',
      hover: {
        brightness: '0.95',
      },
    },
    dark: {
      value: '#3898FE',
      scheme: 'dark',
      hover: {
        brightness: '0.95',
      },
    },
  },
  'surface/blueTint': {
    light: {
      value: '#d6e4f1',
      scheme: 'light',
      text: '#0165d1',
      hover: {
        brightness: '0.95',
      },
    },
    dark: {
      value: '#0f3058',
      scheme: 'dark',
      text: '#4fa1f2',
      hover: {
        brightness: '0.95',
      },
    },
  },
  'surface/green': {
    light: {
      value: '#2a9764',
      scheme: 'dark',
      hover: {
        brightness: '0.95',
      },
    },
    dark: {
      value: '#30a46c',
      scheme: 'dark',
      hover: {
        brightness: '0.95',
      },
    },
  },
  'surface/greenTint': {
    light: {
      value: '#ddf3e4',
      scheme: 'light',
      text: '#2a9764',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: '#123929',
      scheme: 'dark',
      text: '#8cdeb7',
      hover: {
        brightness: '0.9',
      },
    },
  },
  'surface/red': {
    light: {
      value: '#dc3d43',
      scheme: 'dark',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: '#f2555a',
      scheme: 'dark',
      hover: {
        brightness: '0.9',
      },
    },
  },
  'surface/redTint': {
    light: {
      value: '#ffe5e4',
      scheme: 'light',
      text: '#dc3d43',
      hover: {
        brightness: '0.95',
      },
    },
    dark: {
      value: '#541b1e',
      scheme: 'dark',
      text: '#ffb2b5',
      hover: {
        brightness: '0.95',
      },
    },
  },
  'surface/yellow': {
    light: {
      value: '#F9D24A',
      scheme: 'light',
      hover: {
        brightness: '0.95',
      },
    },
    dark: {
      value: '#FFDF3C',
      scheme: 'light',
      hover: {
        brightness: '0.95',
      },
    },
  },
  'surface/yellowTint': {
    light: {
      value: '#fff8bb',
      scheme: 'light',
      text: '#ae8b3a',
      hover: {
        brightness: '0.95',
      },
    },
    dark: {
      value: '#3e3000',
      scheme: 'dark',
      text: '#efc000',
      hover: {
        brightness: '0.95',
      },
    },
  },
  'surface/invert': {
    light: {
      value: 'black',
      scheme: 'dark',
      hover: {
        contrast: '0.7',
      },
    },
    dark: {
      value: 'white',
      scheme: 'light',
      hover: {
        brightness: '0.95',
      },
    },
  },
  'surface/white': {
    light: {
      value: 'white',
      scheme: 'light',
      hover: {
        brightness: '0.98',
      },
    },
    dark: {
      value: 'white',
      scheme: 'light',
      hover: {
        brightness: '0.95',
      },
    },
  },
  'surface/black': {
    light: {
      value: 'black',
      scheme: 'dark',
      hover: {
        contrast: '0.7',
      },
    },
    dark: {
      value: 'black',
      scheme: 'dark',
      hover: {
        contrast: '0.85',
      },
    },
  },
} as const satisfies Record<string, BackgroundColorValue>
export type BackgroundColor = keyof typeof backgroundColor

export type ForegroundColorValue = Record<ColorScheme, string>
export const foregroundColor = {
  'separator/primary': {
    light: '#000000',
    dark: '#ffffff',
  },
  'separator/secondary': {
    light: '#202020',
    dark: '#9f9f9f',
  },
  'separator/tertiary': {
    light: '#E4E5E9',
    dark: '#3C3F43',
  },
  'separator/quarternary': {
    light: '#F1F2F6',
    dark: '#2B2C2F',
  },
  'stroke/primary': {
    light: '#E4E5E9',
    dark: '#3C3F43',
  },
  'stroke/secondary': {
    light: '#F1F2F6',
    dark: '#2B2C2F',
  },
  'text/primary': {
    light: '#000000',
    dark: '#FFFFFF',
  },
  'text/secondary': {
    light: '#5B5C5F',
    dark: '#C2C5CB',
  },
  'text/tertiary': {
    light: '#848789',
    dark: '#9A9BA1',
  },
  'text/quarternary': {
    light: '#A3A4A8',
    dark: '#78797E',
  },
} as const satisfies Record<string, ForegroundColorValue>
export type ForegroundColor = keyof typeof foregroundColor

export type DefaultInheritedColorValue = Record<ColorScheme, string>
export const defaultInheritedColor = {
  accent: {
    light: backgroundColor['surface/invert'].light.value,
    dark: backgroundColor['surface/invert'].dark.value,
  },
  border: {
    light: foregroundColor['stroke/primary'].light,
    dark: foregroundColor['stroke/primary'].dark,
  },
  text: {
    light: foregroundColor['text/primary'].light,
    dark: foregroundColor['text/primary'].dark,
  },
} as const satisfies Record<string, DefaultInheritedColorValue>
export type InheritedColor = keyof typeof defaultInheritedColor

export const fontFamily = {
  default:
    "'SFPro', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  mono: "'SFMono', monospace",
}
export type FontFamily = keyof typeof fontFamily

export type FontAttributes = {
  letterWidth: number
  fontSize: number
  lineHeight: number | `${number}%`
  letterSpacing: number
}
export const fontAttributes = {
  '9px': {
    fontSize: 9,
    letterSpacing: 0.56,
    letterWidth: 5.75,
    lineHeight: 11,
  },
  '11px': {
    fontSize: 11,
    letterSpacing: 0.56,
    letterWidth: 6.9,
    lineHeight: 13,
  },
  '12px': {
    fontSize: 12,
    letterSpacing: 0.52,
    letterWidth: 7.825,
    lineHeight: 15,
  },
  '14px': {
    fontSize: 14,
    letterSpacing: 0.48,
    letterWidth: 8.75,
    lineHeight: 19,
  },
  '15px': {
    fontSize: 15,
    letterSpacing: 0.35,
    letterWidth: 9.25,
    lineHeight: 21,
  },
  '16px': {
    fontSize: 16,
    letterSpacing: 0.35,
    letterWidth: 9.75,
    lineHeight: 21,
  },
  '18px': {
    fontSize: 18,
    letterSpacing: 0.36,
    letterWidth: 10.75,
    lineHeight: 23,
  },
  '20px': {
    fontSize: 20,
    letterSpacing: 0.36,
    letterWidth: 12,
    lineHeight: 25,
  },
  '22px': {
    fontSize: 22,
    letterSpacing: 0.35,
    letterWidth: 13.5,
    lineHeight: 29,
  },
  '26px': {
    fontSize: 26,
    letterSpacing: 0.36,
    letterWidth: 16,
    lineHeight: 32,
  },
  '32px': {
    fontSize: 32,
    letterSpacing: 0.41,
    letterWidth: 20,
    lineHeight: 40,
  },
} satisfies { [key: string]: FontAttributes }

const fontMetrics = {
  capHeight: 1443,
  ascent: 1950,
  descent: -494,
  lineGap: 0,
  unitsPerEm: 2048,
} satisfies CapsizeOptions['fontMetrics']

function defineType(fontAttributes: FontAttributes, inline: boolean) {
  const { fontSize, lineHeight, letterSpacing } = fontAttributes
  const leading =
    typeof lineHeight === 'number'
      ? lineHeight
      : (fontSize * parseInt(lineHeight)) / 100

  if (inline) return { fontSize, letterSpacing }
  return {
    ...capsize({ fontMetrics, fontSize, leading }),
    letterSpacing,
  }
}

export const fontSize = (inline: boolean) =>
  ({
    '9px': defineType(fontAttributes['9px'], inline),
    '11px': defineType(fontAttributes['11px'], inline),
    '12px': defineType(fontAttributes['12px'], inline),
    '14px': defineType(fontAttributes['14px'], inline),
    '15px': defineType(fontAttributes['15px'], inline),
    '16px': defineType(fontAttributes['16px'], inline),
    '18px': defineType(fontAttributes['18px'], inline),
    '20px': defineType(fontAttributes['20px'], inline),
    '22px': defineType(fontAttributes['22px'], inline),
    '26px': defineType(fontAttributes['26px'], inline),
    '32px': defineType(fontAttributes['32px'], inline),
  }) as const
export type FontSize = keyof ReturnType<typeof fontSize>

export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const
export type FontWeight = keyof typeof fontWeight

export const spacing = {
  '0px': '0px',
  '1px': '1px',
  '2px': '0.125rem',
  '4px': '0.25rem',
  '6px': '0.325rem',
  '8px': '0.5rem',
  '12px': '0.75rem',
  '16px': '1rem',
  '20px': '1.25rem',
  '24px': '1.5rem',
  '28px': '1.75rem',
  '32px': '2rem',
  '36px': '2.25rem',
  '40px': '2.5rem',
  '44px': '2.75rem',
  '48px': '3rem',
  '52px': '3.25rem',
  '56px': '3.5rem',
  '60px': '3.75rem',
  '64px': '4rem',
  '68px': '4.25rem',
  '72px': '4.5rem',
  '76px': '4.75rem',
  '80px': '5rem',
  '84px': '5.25rem',
  '88px': '5.5rem',
  '92px': '5.75rem',
  '96px': '6rem',
  '102px': '6.5rem',
  '108px': '7rem',
  '114px': '7.5rem',
  '120px': '8rem',
  '136px': '9rem',
  '152px': '10rem',
} as const
export type Spacing = keyof typeof spacing

export const negatedSpacing = {
  '-0px': '-0px',
  '-1px': '-1px',
  '-2px': '-0.125rem',
  '-4px': '-0.25rem',
  '-6px': '-0.325rem',
  '-8px': '-0.5rem',
  '-12px': '-0.75rem',
  '-16px': '-1rem',
  '-20px': '-1.25rem',
  '-24px': '-1.5rem',
  '-28px': '-1.75rem',
  '-32px': '-2rem',
  '-36px': '-2.25rem',
  '-40px': '-2.5rem',
  '-44px': '-2.75rem',
  '-48px': '-3rem',
  '-52px': '-3.25rem',
  '-56px': '-3.5rem',
  '-60px': '-3.75rem',
  '-64px': '-4rem',
  '-68px': '-4.25rem',
  '-72px': '-4.5rem',
  '-76px': '-4.75rem',
  '-80px': '-5rem',
  '-84px': '-5.25rem',
  '-88px': '-5.5rem',
  '-92px': '-5.75rem',
  '-96px': '-6rem',
  '-102px': '-6.5rem',
  '-108px': '-7rem',
  '-114px': '-7.5rem',
  '-120px': '-8rem',
  '-136px': '-9rem',
  '-152px': '-10rem',
} as const
export type NegatedSpacing = keyof typeof negatedSpacing

export const positionSpacing = {
  '0': 0,
} as const
export type PositionSpacing = keyof typeof positionSpacing

export const radii = {
  round: 9999,
  '3px': 3,
  '6px': 6,
  '12px': 12,
  '14px': 14,
  '16px': 16,
  '18px': 18,
  '20px': 20,
  '24px': 24,
  '30px': 30,
}
export type Radius = keyof typeof radii

export const strokeWeights = {
  '1px': 1,
  '1.5px': 1.5,
  '2px': 2,
}
export type StrokeWeight = keyof typeof strokeWeights

// Note: Don't forget to generate the symbols with `bun run symbols`!
export const symbolNames = [
  'arrow.clockwise',
  'arrow.left.arrow.right',
  'checkmark',
  'clock',
  'doc.on.doc',
  'hammer.fill',
  'wallet.pass',
  'person.circle',
  'chevron.down',
  'chevron.right.2',
  'chevron.left',
  'trash',
  'xmark',
  'arrow.right',
  'arrowtriangle.left.and.line.vertical.and.arrowtriangle.right',
] as const
export type SymbolName = typeof symbolNames[number]

export const textAlignment = ['left', 'center', 'right'] as const
export type TextAlignment = typeof textAlignment[number]

export const viewports = {
  '1152px': '72rem',
}
export type Viewport = keyof typeof viewports
