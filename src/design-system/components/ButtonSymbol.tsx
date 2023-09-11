import { forwardRef } from 'react'

import type { UnionOmit } from '~/utils/types'

import type { SymbolName } from '../tokens'
import { ButtonRoot, type ButtonRootProps } from './Button'
import { type ButtonHeight, type ButtonVariant } from './Button.css'
import { stylesForHeight } from './ButtonSymbol.css'
import { SFSymbol } from './SFSymbol'
import type { SFSymbolProps } from './SFSymbol'

type ButtonSymbolProps = UnionOmit<ButtonRootProps, 'children'> & {
  symbol: SymbolName
  symbolProps?: Partial<SFSymbolProps>
}

const symbolStylesForHeight = {
  '20px': {
    size: '11px',
  },
  '24px': {
    size: '12px',
  },
  '36px': {
    size: '15px',
  },
  '44px': {
    size: '18px',
  },
} satisfies Record<ButtonHeight, { size: SFSymbolProps['size'] }>

const symbolStylesForVariant = {
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
} satisfies Record<ButtonVariant, { color?: SFSymbolProps['color'] }>

export const ButtonSymbol = forwardRef<HTMLDivElement, ButtonSymbolProps>(
  (
    { symbol, symbolProps, width = 'fit', ...rootProps }: ButtonSymbolProps,
    ref,
  ) => {
    const { height = '36px', variant = 'solid invert' } = rootProps
    return (
      <ButtonRoot
        ref={ref}
        width={width}
        {...rootProps}
        className={[stylesForHeight[height], rootProps.className]}
      >
        <SFSymbol
          symbol={symbol}
          {...symbolStylesForHeight[height]}
          {...symbolStylesForVariant[variant]}
          {...symbolProps}
        />
      </ButtonRoot>
    )
  },
)
