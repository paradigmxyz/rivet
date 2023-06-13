import { type StrokeWeight, strokeWeights } from '../tokens'
import { Box } from './Box'
import type { BoxStyles } from './Box.css'

export type SeparatorProps = {
  color?: BoxStyles['backgroundColor']
  strokeWeight?: StrokeWeight
}

export function Separator({
  color = 'separator/tertiary',
  strokeWeight = '1px',
}: SeparatorProps) {
  return (
    <Box
      borderRadius='round'
      backgroundColor={color}
      style={{ height: strokeWeights[strokeWeight] }}
    />
  )
}
