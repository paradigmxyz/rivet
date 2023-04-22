export const animation = {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
}
export type Animation = keyof typeof animation

export const borderRadius = {
  '0px': '0px',
  '2px': '0.125rem',
  DEFAULT: '0.25rem',
  '4px': '0.25rem',
  '6px': '0.375rem',
  '8px': '0.5rem',
  '12px': '0.75rem',
  '16px': '1rem',
  '24px': '1.5rem',
  full: '9999px',
}
export type BorderRadius = keyof typeof backgroundColor

export const backgroundColor = {
  accent: 'rgb(var(--accentColor))',
  primary: 'rgb(var(--backgroundColor--primary))',
  surface: 'rgb(var(--backgroundColor--surface))',
}
export type BackgroundColor = keyof typeof backgroundColor

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
  '12px': ['0.75rem', { lineHeight: '1rem' }],
  '14px': ['0.875rem', { lineHeight: '1.25rem' }],
  '16px': ['1rem', { lineHeight: '1.5rem' }],
  '18px': ['1.125rem', { lineHeight: '1.75rem' }],
  '20px': ['1.25rem', { lineHeight: '1.75rem' }],
  '22px': ['1.375rem', { lineHeight: '1.825rem' }],
  '24px': ['1.5rem', { lineHeight: '2rem' }],
  '28px': ['1.75rem', { lineHeight: '2rem' }],
  '32px': ['2rem', { lineHeight: '2.25rem' }],
  '36px': ['2.25rem', { lineHeight: '2.5rem' }],
  '40px': ['2.5rem', { lineHeight: '2.75rem' }],
  '48px': ['3rem', { lineHeight: '1' }],
  '64px': ['4rem', { lineHeight: '1' }],
  '72px': ['4.5rem', { lineHeight: '1' }],
  '96px': ['6rem', { lineHeight: '1' }],
} as const
export type FontSize = keyof typeof fontSize

export const foregroundColor = {
  'bg-primary': backgroundColor.primary,
  'bg-surface': backgroundColor.surface,
  accent: 'rgb(var(--accentColor))',
  label: 'rgb(var(--foregroundColor-label))',
}
export type ForegroundColor = keyof typeof foregroundColor

export const keyframes = {
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' },
  },
} as const
export type Keyframes = keyof typeof keyframes

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

// Note: Don't forget to generate the symbols with `pnpm symbols`!
export const symbolNames = ['wallet.pass', 'person.circle'] as const
export type SymbolName = typeof symbolNames[number]

export const textAlignment = ['left', 'center', 'right'] as const
export type TextAlignment = typeof textAlignment[number]
