import { createVar, styleVariants } from '@vanilla-extract/css'

export const strokeWeightVar = createVar()

export const orientation = styleVariants({
  horizontal: {
    height: strokeWeightVar,
    width: '100%',
  },
  vertical: {
    height: '100%',
    width: strokeWeightVar,
  },
})
