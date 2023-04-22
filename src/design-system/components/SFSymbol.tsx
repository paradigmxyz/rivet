import { cn } from '../utils/cn'
import symbols from '../../design-system/symbols/generated'
import type {
  FontSize,
  FontWeight,
  ForegroundColor,
  SymbolName,
} from '../../design-system/tokens'

export type SFSymbolProps = {
  color?: ForegroundColor
  symbol: SymbolName
  weight?: FontWeight
  size?: FontSize
}

export function SFSymbol({
  color = 'label',
  symbol: name,
  weight = 'regular',
  size = '16px',
}: SFSymbolProps) {
  const symbol = symbols[name as keyof typeof symbols][weight]
  return (
    <div>
      <svg
        viewBox={`0 0 ${symbol.viewBox.width} ${symbol.viewBox.height}`}
        fill="none"
        className={cn(
          `text-${color}`,
          `h-[theme(fontSize.${size})]`,
          `w-[theme(fontSize.${size})]`,
        )}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={symbol.path} fill="currentColor" />
      </svg>
    </div>
  )
}
