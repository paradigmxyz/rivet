import { forwardRef } from 'react'
import { SFSymbol } from '~/design-system'
import type { BoxStyles } from '~/design-system/components/Box.css.ts'
import type { ButtonVariant } from '~/design-system/components/Button.css.ts'
import type { SFSymbolOptionalProps } from '~/design-system/components/SFSymbol.tsx'
import type { SymbolName } from '~/design-system/tokens.ts'
import { Box } from './Box'
import { type IconButtonSize, iconButtonHeightStyles } from './IconButton.css'

type IconButtonProps = {
  icon: SymbolName
  disabled?: boolean
  size?: IconButtonSize
  variant?: ButtonVariant
  symbolProps?: SFSymbolOptionalProps
} & (
  | {
      as?: 'button'
      href?: never
      onClick?: (e?: any) => void
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
  'solid transparent': {
    backgroundColor: {
      hover: 'surface/fill/secondary',
    },
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
      hover: 'surface/red@0.2',
    },
    borderColor: 'surface/red@0.4',
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

const iconStylesForHeight = {
  '20px': {
    size: '12px',
  },
  '24px': {
    size: '16px',
  },
  '36px': {
    size: '20px',
  },
  '44px': {
    size: '26px',
  },
} satisfies Record<IconButtonSize, { size: SFSymbolOptionalProps['size'] }>

export const IconButton = forwardRef<HTMLDivElement, IconButtonProps>(
  (
    {
      as = 'button',
      disabled,
      icon,
      size = '36px',
      href,
      onClick,
      variant = 'solid transparent',
      symbolProps,
    }: IconButtonProps,
    ref,
  ) => {
    return (
      <Box
        ref={ref as any}
        as={as}
        href={href}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={onClick}
        cursor={disabled ? 'not-allowed' : 'pointer'}
        hoverable={!disabled}
        borderRadius="3px"
        className={iconButtonHeightStyles[size]}
        transform={{ hoveractive: 'shrink95' }}
        {...stylesForVariant[variant]}
      >
        <SFSymbol
          {...symbolProps}
          symbol={icon}
          {...iconStylesForHeight[size]}
        />
      </Box>
    )
  },
)
