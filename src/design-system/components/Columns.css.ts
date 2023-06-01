import { styleVariants } from '@vanilla-extract/css'
import { calc } from '@vanilla-extract/css-utils'

import { gapVar } from './Box.css'

const columnWidths = {
  '0': [0, 1],
  '1/2': [1, 2],
  '1/3': [1, 3],
  '1/4': [1, 4],
  '1/5': [1, 5],
  '2/3': [2, 3],
  '2/5': [2, 5],
  '3/4': [3, 4],
  '3/5': [3, 5],
  '4/5': [4, 5],
} as const

export const width = styleVariants(columnWidths, ([numerator, denominator]) => {
  const gapOffset = calc.subtract(
    gapVar,
    calc(gapVar).divide(denominator).multiply(numerator),
  )

  return {
    width: calc.subtract(`${(numerator * 100) / denominator}%`, gapOffset),
  }
})
