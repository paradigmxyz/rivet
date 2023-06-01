import * as globalColors from '@radix-ui/colors'

export type Theme = 'light' | 'dark'
export type ColorScheme = 'light' | 'dark'

export type BackgroundColorValue = Record<
  Theme,
  { value: string; scheme: ColorScheme; border?: string; text?: string }
>
export const backgroundColor = {
  body: {
    light: {
      value: globalColors.gray.gray3,
      scheme: 'light',
      border: globalColors.gray.gray5,
      text: globalColors.grayDark.gray1,
    },
    dark: {
      value: globalColors.grayDark.gray1,
      scheme: 'dark',
      border: globalColors.grayDark.gray2,
      text: globalColors.gray.gray1,
    },
  },
  bodyHover: {
    light: {
      value: globalColors.gray.gray4,
      scheme: 'light',
      border: globalColors.gray.gray5,
      text: globalColors.grayDark.gray1,
    },
    dark: {
      value: globalColors.grayDark.gray2,
      scheme: 'dark',
      border: globalColors.grayDark.gray2,
      text: globalColors.gray.gray1,
    },
  },
  surface: {
    light: {
      value: globalColors.gray.gray1,
      scheme: 'light',
    },
    dark: {
      value: globalColors.grayDark.gray3,
      scheme: 'dark',
      border: globalColors.grayDark.gray4,
    },
  },
  surfaceHover: {
    light: {
      value: globalColors.gray.gray2,
      scheme: 'light',
    },
    dark: {
      value: globalColors.grayDark.gray4,
      scheme: 'dark',
      border: globalColors.grayDark.gray4,
    },
  },
  primary: {
    light: {
      value: globalColors.slateDark.slate1,
      scheme: 'dark',
      border: globalColors.slateDark.slate8,
    },
    dark: {
      value: globalColors.slate.slate1,
      scheme: 'light',
      border: globalColors.slate.slate4,
    },
  },
  primaryHover: {
    light: {
      value: globalColors.slateDark.slate4,
      scheme: 'dark',
      border: globalColors.slateDark.slate8,
    },
    dark: {
      value: globalColors.slate.slate4,
      scheme: 'light',
      border: globalColors.slate.slate4,
    },
  },
  black: {
    light: {
      value: 'black',
      scheme: 'dark',
    },
    dark: {
      value: 'black',
      scheme: 'dark',
    },
  },
  blackHover: {
    light: {
      value: 'black',
      scheme: 'dark',
    },
    dark: {
      value: globalColors.grayDark.gray2,
      scheme: 'dark',
    },
  },
  white: {
    light: {
      value: 'white',
      scheme: 'light',
    },
    dark: {
      value: 'white',
      scheme: 'light',
    },
  },
  whiteHover: {
    light: {
      value: globalColors.gray.gray1,
      scheme: 'light',
    },
    dark: {
      value: globalColors.gray.gray4,
      scheme: 'light',
    },
  },
  red: {
    light: {
      value: globalColors.red.red10,
      scheme: 'light',
      text: globalColors.red.red2,
      border: globalColors.red.red11,
    },
    dark: {
      value: globalColors.redDark.red10,
      scheme: 'light',
      text: globalColors.red.red2,
      border: globalColors.redDark.red11,
    },
  },
  redHover: {
    light: {
      value: globalColors.red.red9,
      scheme: 'light',
      text: globalColors.red.red2,
      border: globalColors.red.red11,
    },
    dark: {
      value: globalColors.redDark.red10,
      scheme: 'light',
      text: globalColors.red.red2,
      border: globalColors.redDark.red11,
    },
  },
  redTint: {
    light: {
      value: globalColors.red.red4,
      scheme: 'light',
      text: globalColors.red.red10,
      border: globalColors.red.red6,
    },
    dark: {
      value: globalColors.redDark.red5,
      scheme: 'dark',
      text: globalColors.red.red9,
      border: globalColors.redDark.red7,
    },
  },
  redTintHover: {
    light: {
      value: globalColors.red.red5,
      scheme: 'light',
      text: globalColors.red.red10,
      border: globalColors.red.red6,
    },
    dark: {
      value: globalColors.redDark.red6,
      scheme: 'dark',
      text: globalColors.red.red9,
      border: globalColors.redDark.red7,
    },
  },
  green: {
    light: {
      value: globalColors.green.green10,
      scheme: 'light',
      text: globalColors.green.green2,
      border: globalColors.greenA.greenA9,
    },
    dark: {
      value: globalColors.greenDark.green9,
      scheme: 'light',
      text: globalColors.green.green2,
      border: globalColors.greenDark.green11,
    },
  },
  greenHover: {
    light: {
      value: globalColors.green.green9,
      scheme: 'light',
      text: globalColors.green.green2,
      border: globalColors.greenA.greenA9,
    },
    dark: {
      value: globalColors.greenDark.green10,
      scheme: 'light',
      text: globalColors.green.green2,
      border: globalColors.greenDark.green11,
    },
  },
  greenTint: {
    light: {
      value: globalColors.green.green4,
      scheme: 'light',
      text: globalColors.green.green10,
      border: globalColors.green.green6,
    },
    dark: {
      value: globalColors.greenDark.green5,
      scheme: 'dark',
      text: globalColors.greenDark.green11,
      border: globalColors.greenDark.green8,
    },
  },
  greenTintHover: {
    light: {
      value: globalColors.green.green5,
      scheme: 'light',
      text: globalColors.green.green10,
      border: globalColors.green.green6,
    },
    dark: {
      value: globalColors.greenDark.green6,
      scheme: 'dark',
      text: globalColors.greenDark.green11,
      border: globalColors.greenDark.green8,
    },
  },
  yellow: {
    light: {
      value: globalColors.yellowDark.yellow11,
      scheme: 'light',
      text: globalColors.yellow.yellow12,
      border: globalColors.yellowDark.yellow11,
    },
    dark: {
      value: globalColors.yellowDark.yellow11,
      scheme: 'light',
      text: globalColors.yellow.yellow12,
      border: globalColors.yellowDark.yellow11,
    },
  },
  yellowTint: {
    light: {
      value: globalColors.yellow.yellow4,
      scheme: 'light',
      text: globalColors.yellow.yellow11,
      border: globalColors.yellow.yellow6,
    },
    dark: {
      value: globalColors.yellowDark.yellow5,
      scheme: 'dark',
      text: globalColors.yellowDark.yellow11,
      border: globalColors.yellowDark.yellow7,
    },
  },
} as const satisfies Record<string, BackgroundColorValue>
export type BackgroundColor = keyof typeof backgroundColor

export type ForegroundColorValue = Record<ColorScheme, string>
export const foregroundColor = {
  label: {
    light: globalColors.gray.gray11,
    dark: globalColors.grayDark.gray11,
  },
  scrim: {
    light: globalColors.blackA.blackA5,
    dark: globalColors.grayDark.gray6,
  },
} as const satisfies Record<string, ForegroundColorValue>
export type ForegroundColor = keyof typeof foregroundColor

export type DefaultInheritedColorValue = Record<ColorScheme, string>
export const defaultInheritedColor = {
  accent: {
    light: backgroundColor.primary.light.value,
    dark: backgroundColor.primary.dark.value,
  },
  border: {
    light: backgroundColor.body.light.border,
    dark: backgroundColor.body.dark.border,
  },
  text: {
    light: backgroundColor.body.light.text,
    dark: backgroundColor.body.dark.text,
  },
} as const satisfies Record<string, DefaultInheritedColorValue>
export type InheritedColor = keyof typeof defaultInheritedColor

export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const
export type FontWeight = keyof typeof fontWeight

export const fontSize = {
  '12px': { fontSize: '0.75rem', lineHeight: '1rem' },
  '14px': { fontSize: '0.875rem', lineHeight: '1.25rem' },
  '16px': { fontSize: '1rem', lineHeight: '1.5rem' },
  '18px': { fontSize: '1.125rem', lineHeight: '1.75rem' },
  '20px': { fontSize: '1.25rem', lineHeight: '1.75rem' },
  '22px': { fontSize: '1.375rem', lineHeight: '1.825rem' },
  '24px': { fontSize: '1.5rem', lineHeight: '2rem' },
  '28px': { fontSize: '1.75rem', lineHeight: '2rem' },
  '32px': { fontSize: '2rem', lineHeight: '2.25rem' },
  '36px': { fontSize: '2.25rem', lineHeight: '2.5rem' },
  '40px': { fontSize: '2.5rem', lineHeight: '2.75rem' },
  '48px': { fontSize: '3rem', lineHeight: '1' },
  '64px': { fontSize: '4rem', lineHeight: '1' },
  '72px': { fontSize: '4.5rem', lineHeight: '1' },
  '96px': { fontSize: '6rem', lineHeight: '1' },
} as const
export type FontSize = keyof typeof fontSize

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
  'wallet.pass',
  'person.circle',
  'chevron.down',
  'xmark',
] as const
export type SymbolName = typeof symbolNames[number]

export const textAlignment = ['left', 'center', 'right'] as const
export type TextAlignment = typeof textAlignment[number]

export const viewports = {
  '1152px': '72rem',
}
export type Viewport = keyof typeof viewports
