import type { ClassValue } from 'clsx'
import { forwardRef } from 'react'

import symbols from '../symbols/generated'
import type { FontSize, FontWeight, SymbolName } from '../tokens'
import { Box } from './Box'
import type { BoxStyles } from './Box.css'

export type SFSymbolProps = {
  className?: ClassValue
  color?: BoxStyles['color']
  weight?: FontWeight
  symbol: SymbolName
  size?: FontSize
}

export const SFSymbol = forwardRef<SVGSVGElement, SFSymbolProps>(
  (
    {
      className,
      color = 'text',
      symbol: name,
      weight = 'regular',
      size = '16px',
    }: SFSymbolProps,
    ref,
  ) => {
    const symbol = symbols[name as keyof typeof symbols][weight]
    return (
      <Box
        ref={ref}
        as="svg"
        className={className}
        viewBox={`0 0 ${symbol.viewBox.width} ${symbol.viewBox.height}`}
        fill="none"
        color={color}
        style={{
          width: size,
          height: size,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={symbol.path} fill="currentColor" />
      </Box>
    )
  },
)
