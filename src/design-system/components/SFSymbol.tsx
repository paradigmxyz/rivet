import symbols from '../../design-system/symbols/generated'
import type {
  FontSize,
  FontWeight,
  SymbolName,
} from '../../design-system/tokens'
import { Box } from './Box'
import { BoxStyles } from './Box.css'

export type SFSymbolProps = {
  color?: BoxStyles['color']
  symbol: SymbolName
  weight?: FontWeight
  size?: FontSize
}

export function SFSymbol({
  color = 'text',
  symbol: name,
  weight = 'regular',
  size = '16px',
}: SFSymbolProps) {
  const symbol = symbols[name as keyof typeof symbols][weight]
  return (
    <Box>
      <Box
        as="svg"
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
    </Box>
  )
}
