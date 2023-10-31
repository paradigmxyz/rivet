import { forwardRef } from 'react'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import { ButtonRoot, type ButtonRootProps } from './Button'
import { type ButtonHeight, type ButtonVariant } from './Button.css'
import { Text, type TextProps } from './Text'

type ButtonTextProps = ButtonRootProps

const stylesForHeight = {
  '16px': {
    paddingHorizontal: '4px',
  },
  '18px': {
    paddingHorizontal: '6px',
  },
  '20px': {
    paddingHorizontal: '6px',
  },
  '24px': {
    paddingHorizontal: '6px',
  },
  '36px': {
    paddingHorizontal: '12px',
  },
  '44px': {
    paddingHorizontal: '16px',
  },
} satisfies Record<ButtonHeight, BoxStyles>

const textStylesForHeight = {
  '16px': {
    size: '9px',
  },
  '18px': {
    size: '11px',
  },
  '20px': {
    size: '11px',
  },
  '24px': {
    size: '11px',
  },
  '36px': {
    size: '15px',
  },
  '44px': {
    size: '18px',
  },
} satisfies Record<ButtonHeight, { size: TextProps['size'] }>

const textStylesForVariant = {
  'ghost primary': {},
  'ghost blue': {
    color: 'surface/blue',
  },
  'ghost green': {
    color: 'surface/green',
  },
  'ghost red': {
    color: 'surface/red',
  },
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

export const ButtonText = forwardRef<HTMLDivElement, ButtonTextProps>(
  ({ children, width = 'full', ...props }: ButtonTextProps, ref) => {
    const { height = '36px', variant = 'solid invert' } = props
    return (
      <ButtonRoot ref={ref} width={width} {...props}>
        <Box {...stylesForHeight[height]}>
          <Text
            {...textStylesForVariant[variant]}
            {...textStylesForHeight[height]}
          >
            {children}
          </Text>
        </Box>
      </ButtonRoot>
    )
  },
)
