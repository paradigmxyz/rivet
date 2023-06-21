import { forwardRef } from 'react'

import { type StrokeWeight } from '../tokens'
import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import * as styles from './Separator.css'
import { assignInlineVars } from '@vanilla-extract/dynamic'

export type SeparatorProps = {
  color?: BoxStyles['backgroundColor']
  orientation?: 'horizontal' | 'vertical'
  strokeWeight?: StrokeWeight
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      color = 'separator/tertiary',
      orientation = 'horizontal',
      strokeWeight = '1px',
    }: SeparatorProps,
    ref,
  ) => {
    return (
      <Box
        ref={ref}
        borderRadius='round'
        backgroundColor={color}
        className={styles.orientation[orientation]}
        style={assignInlineVars({
          [styles.strokeWeightVar]: strokeWeight,
        })}
      />
    )
  },
)
