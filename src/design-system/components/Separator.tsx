import { StrokeWeight, strokeWeights } from '../tokens'
import { Box } from './Box'
import { BoxStyles } from './Box.css'

export type SeparatorProps = {
  color?: BoxStyles['backgroundColor']
  strokeWeight?: StrokeWeight
}

export function Separator({
  color = 'primary / 0.1',
  strokeWeight = '1px',
}: SeparatorProps) {
  return (
    <Box
      borderRadius="round"
      backgroundColor={color}
      style={{ height: strokeWeights[strokeWeight] }}
    />
  )
}
