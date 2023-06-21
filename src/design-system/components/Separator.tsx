import { type StrokeWeight, strokeWeights } from '../tokens'
import { Box } from './Box'
import type { BoxStyles } from './Box.css'

export type SeparatorProps = {
  color?: BoxStyles['backgroundColor']
  orientation?: 'horizontal' | 'vertical'
  strokeWeight?: StrokeWeight
}

export function Separator({
  color = 'separator/tertiary',
  orientation = 'horizontal',
  strokeWeight = '1px',
}: SeparatorProps) {
  return (
    <Box
      borderRadius='round'
      backgroundColor={color}
      {...(orientation === 'horizontal'
        ? {
            style: { height: strokeWeights[strokeWeight] },
            width: 'full',
          }
        : {
            style: { width: strokeWeights[strokeWeight] },
            height: 'full',
          })}
    />
  )
}
