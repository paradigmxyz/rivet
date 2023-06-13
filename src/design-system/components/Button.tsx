import * as React from 'react'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import {
  type ButtonHeight,
  type ButtonVariant,
  buttonHeightStyles,
} from './Button.css'
import { Text, type TextProps } from './Text'

type ButtonProps = {
  children: string | React.ReactNode
  height?: ButtonHeight
  width?: 'fit' | 'full'
  variant?: ButtonVariant
} & (
  | {
      as?: 'button'
      href?: never
      onClick?: () => void
      type?: 'button' | 'submit'
    }
  | {
      as?: 'div'
      href?: never
      onClick?: () => void
      type?: never
    }
  | {
      as: 'a'
      href: string
      onClick?: never
      type?: never
    }
)

const stylesForHeight = {
  '36px': {
    paddingHorizontal: '12px',
  },
  '44px': {
    paddingHorizontal: '16px',
  },
} satisfies Record<ButtonHeight, BoxStyles>

const stylesForVariant = {
  'solid surface/invert': {
    backgroundColor: 'surface/invert',
  },
  'solid surface/primary': {
    backgroundColor: 'surface/primary',
  },
  'solid surface/secondary/elevated': {
    backgroundColor: 'surface/secondary/elevated',
  },
  'solid surface/fill/tertiary': {
    backgroundColor: 'surface/fill/tertiary',
  },
  'solid surface/blue': {
    backgroundColor: 'surface/blue',
  },
  'solid surface/green': {
    backgroundColor: 'surface/green',
  },
  'solid surface/red': {
    backgroundColor: 'surface/red',
    borderWidth: '1px',
  },
  'stroked surface/fill': {
    backgroundColor: {
      hover: 'surface/invert@0.02',
    },
    borderColor: 'surface/fill',
    borderWidth: '1px',
  },
  'stroked surface/invert': {
    backgroundColor: {
      hover: 'surface/invert@0.05',
    },
    borderWidth: '1px',
  },
  'stroked surface/blue': {
    backgroundColor: {
      hover: 'surface/blue@0.05',
    },
    borderColor: 'surface/blue',
    borderWidth: '1px',
  },
  'stroked surface/red': {
    backgroundColor: {
      hover: 'surface/red@0.05',
    },
    borderColor: 'surface/red',
    borderWidth: '1px',
  },
  'stroked surface/green': {
    backgroundColor: {
      hover: 'surface/green@0.05',
    },
    borderColor: 'surface/green',
    borderWidth: '1px',
  },
  'tint surface/blue': {
    backgroundColor: 'surface/blueTint',
  },
  'tint surface/green': {
    backgroundColor: 'surface/greenTint',
  },
  'tint surface/red': {
    backgroundColor: 'surface/redTint',
  },
} satisfies Record<ButtonVariant, BoxStyles>

const textStylesForHeight = {
  '36px': {
    size: '15px',
  },
  '44px': {
    size: '18px',
  },
} satisfies Record<ButtonHeight, { size: TextProps['size'] }>

const textStylesForVariant = {
  'solid surface/invert': {},
  'solid surface/primary': {},
  'solid surface/secondary/elevated': {},
  'solid surface/fill/tertiary': {},
  'solid surface/blue': {},
  'solid surface/green': {},
  'solid surface/red': {},
  'stroked surface/fill': {},
  'stroked surface/invert': {},
  'stroked surface/blue': {
    color: 'surface/blue',
  },
  'stroked surface/red': {
    color: 'surface/red',
  },
  'stroked surface/green': {
    color: 'surface/green',
  },
  'tint surface/blue': {},
  'tint surface/green': {},
  'tint surface/red': {},
} satisfies Record<ButtonVariant, { color?: TextProps['color'] }>

export function Button({
  as = 'button',
  children,
  height = '36px',
  href,
  onClick,
  variant = 'solid surface/invert',
  width = 'full',
}: ButtonProps) {
  return (
    <Box
      as={as}
      href={href}
      onClick={onClick}
      className={buttonHeightStyles[height]}
      cursor='pointer'
      display='flex'
      alignItems='center'
      justifyContent='center'
      hoverable
      width={width}
      transform={{
        hoveractive: 'shrink',
      }}
      {...stylesForVariant[variant]}
      {...stylesForHeight[height]}
    >
      <Text {...textStylesForVariant[variant]} {...textStylesForHeight[height]}>
        {children}
      </Text>
    </Box>
  )
}
