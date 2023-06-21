import { forwardRef } from 'react'

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
  disabled?: boolean
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
  'solid invert': {
    backgroundColor: 'surface/invert',
  },
  'solid primary': {
    backgroundColor: 'surface/primary',
  },
  'solid fill': {
    backgroundColor: 'surface/fill/tertiary',
  },
  'solid blue': {
    backgroundColor: 'surface/blue',
  },
  'solid green': {
    backgroundColor: 'surface/green',
  },
  'solid red': {
    backgroundColor: 'surface/red',
  },
  'stroked fill': {
    backgroundColor: {
      hover: 'surface/invert@0.02',
    },
    borderColor: 'surface/fill',
    borderWidth: '1px',
  },
  'stroked invert': {
    backgroundColor: {
      hover: 'surface/invert@0.05',
    },
    borderWidth: '1px',
  },
  'stroked blue': {
    backgroundColor: {
      hover: 'surface/blue@0.05',
    },
    borderColor: 'surface/blue',
    borderWidth: '1px',
  },
  'stroked red': {
    backgroundColor: {
      hover: 'surface/red@0.05',
    },
    borderColor: 'surface/red',
    borderWidth: '1px',
  },
  'stroked green': {
    backgroundColor: {
      hover: 'surface/green@0.05',
    },
    borderColor: 'surface/green',
    borderWidth: '1px',
  },
  'tint blue': {
    backgroundColor: 'surface/blueTint',
  },
  'tint green': {
    backgroundColor: 'surface/greenTint',
  },
  'tint red': {
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
  'solid invert': {},
  'solid primary': {},
  'solid fill': {},
  'solid blue': {},
  'solid green': {},
  'solid red': {},
  'stroked fill': {},
  'stroked invert': {},
  'stroked blue': {
    color: 'surface/blue',
  },
  'stroked red': {
    color: 'surface/red',
  },
  'stroked green': {
    color: 'surface/green',
  },
  'tint blue': {},
  'tint green': {},
  'tint red': {},
} satisfies Record<ButtonVariant, { color?: TextProps['color'] }>

export const Button = forwardRef<HTMLDivElement, ButtonProps>(
  (
    {
      as = 'button',
      children,
      disabled,
      height = '36px',
      href,
      onClick,
      variant = 'solid invert',
      width = 'full',
    }: ButtonProps,
    ref,
  ) => {
    return (
      <Box
        ref={ref as any}
        as={as}
        href={href}
        onClick={onClick}
        disabled={disabled}
        className={buttonHeightStyles[height]}
        cursor={disabled ? 'not-allowed' : 'pointer'}
        display='flex'
        alignItems='center'
        justifyContent='center'
        hoverable={!disabled}
        opacity={disabled ? '0.5' : undefined}
        width={width}
        transform={
          disabled
            ? {}
            : {
                hoveractive: 'shrink',
              }
        }
        {...stylesForVariant[variant]}
        {...stylesForHeight[height]}
      >
        <Text
          {...textStylesForVariant[variant]}
          {...textStylesForHeight[height]}
        >
          {children}
        </Text>
      </Box>
    )
  },
)
