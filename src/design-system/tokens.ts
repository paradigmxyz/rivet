import { createStyleObject as capsize } from '@capsizecss/core'

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
  mono: "'SFMono', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'Lucida Console', Monaco, monospace",
}

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

export const fontSize = {
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
} as const
export type FontSize = keyof typeof fontSize

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

// Note: Don't forget to generate the symbols with `pnpm symbols`!
export const symbolNames = [
  'arrow.clockwise',
  'doc.on.doc',
  'wallet.pass',
  'person.circle',
  'chevron.down',
  'chevron.right.2',
  'xmark',
] as const
export type SymbolName = typeof symbolNames[number]

export const textAlignment = ['left', 'center', 'right'] as const
export type TextAlignment = typeof textAlignment[number]

export const viewports = {
  '1152px': '72rem',
}
export type Viewport = keyof typeof viewports
