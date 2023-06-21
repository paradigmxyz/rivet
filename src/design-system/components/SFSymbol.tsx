import symbols from '../symbols/generated'
import type { FontSize, FontWeight, SymbolName } from '../tokens'
import type { ClassValue } from 'clsx'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'

export type SFSymbolProps = {
  className?: ClassValue
  color?: BoxStyles['color']
  symbol: SymbolName
  weight?: FontWeight
  size?: FontSize
}

export function SFSymbol({
  className,
  color = 'text',
  symbol: name,
  weight = 'regular',
  size = '16px',
}: SFSymbolProps) {
  const symbol = symbols[name as keyof typeof symbols][weight]
  return (
    <Box
      as='svg'
      className={className}
      viewBox={`0 0 ${symbol.viewBox.width} ${symbol.viewBox.height}`}
      fill='none'
      color={color}
      style={{
        width: size,
        height: size,
      }}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d={symbol.path} fill='currentColor' />
    </Box>
  )
}
