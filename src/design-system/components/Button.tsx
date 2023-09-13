import type { ClassValue } from 'clsx'
import { type MouseEventHandler, forwardRef } from 'react'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import {
  type ButtonHeight,
  type ButtonVariant,
  buttonHeightStyles,
} from './Button.css'
import { ButtonSymbol } from './ButtonSymbol'
import { ButtonText } from './ButtonText'

export type ButtonRootProps = {
  children: string | React.ReactNode
  className?: ClassValue
  disabled?: boolean
  height?: ButtonHeight
  width?: 'fit' | 'full'
  variant?: ButtonVariant
} & (
  | {
      as: 'button'
      href?: never
      onClick?: MouseEventHandler<HTMLButtonElement>
      type?: 'button' | 'submit'
    }
  | {
      as?: 'button'
      href?: never
      onClick?: MouseEventHandler<HTMLButtonElement>
      type: 'button' | 'submit'
    }
  | {
      as?: 'div'
      href?: never
      onClick?: MouseEventHandler<HTMLDivElement>
      type?: never
    }
  | {
      as?: 'a'
      href: string
      onClick?: never
      type?: never
    }
)

const stylesForVariant = {
  'ghost primary': {
    backgroundColor: {
      hover: 'surface/invert@0.05',
    },
  },
  'ghost blue': {
    backgroundColor: {
      hover: 'surface/blueTint@0.5',
    },
  },
  'ghost green': {
    backgroundColor: {
      hover: 'surface/greenTint@0.5',
    },
  },
  'ghost red': {
    backgroundColor: {
      hover: 'surface/redTint@0.5',
    },
  },
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
      hover: 'surface/invert@0.05',
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
      hover: 'surface/blue@0.2',
    },
    borderColor: 'surface/blue',
    borderWidth: '1px',
  },
  'stroked red': {
    backgroundColor: {
      hover: 'surface/red@0.2',
    },
    borderColor: 'surface/red',
    borderWidth: '1px',
  },
  'stroked green': {
    backgroundColor: {
      hover: 'surface/green@0.2',
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

export const ButtonRoot = forwardRef<HTMLDivElement, ButtonRootProps>(
  (
    {
      as = 'button',
      children,
      className,
      disabled,
      height = '36px',
      href,
      onClick,
      width,
      variant = 'solid invert',
    }: ButtonRootProps,
    ref,
  ) => {
    return (
      <Box
        ref={ref as any}
        as={as}
        href={href}
        onClick={onClick as any}
        disabled={disabled}
        className={[buttonHeightStyles[height], className]}
        cursor={disabled ? 'not-allowed' : 'pointer'}
        display="flex"
        alignItems="center"
        justifyContent="center"
        hoverable={!disabled}
        opacity={disabled ? '0.5' : undefined}
        transform={
          disabled
            ? {}
            : {
                hoveractive: 'shrink',
              }
        }
        width={width}
        {...stylesForVariant[variant]}
      >
        {children}
      </Box>
    )
  },
)

export const Button = Object.assign(ButtonText, {
  Root: ButtonRoot,
  Symbol: ButtonSymbol,
})
