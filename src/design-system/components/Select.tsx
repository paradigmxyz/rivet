import { type ReactNode, type SelectHTMLAttributes, forwardRef } from 'react'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import {
  type SelectHeight,
  type SelectVariant,
  backgroundStyle,
  disabledStyle,
  heightStyles,
  invalidStyle,
} from './Select.css'
import type { TextStyles } from './Text.css'
import * as styles from './Text.css'

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  keyof BoxStyles
> & {
  children: ReactNode
  height?: SelectHeight
  placeholder?: string
  testId?: string
  variant?: SelectVariant
}

export const stylesForVariant = {
  solid: {
    backgroundColor: {
      default: 'surface/primary/elevated',
      disabled: 'surface/secondary/elevated',
    },
    borderColor: {
      default: 'surface/invert@0.2',
      hover: 'surface/invert@0.3',
      focus: 'surface/invert@0.7',
      hoverfocus: 'surface/invert@0.7',
    },
  },
} satisfies Record<SelectVariant, BoxStyles>

export const stylesForHeight = {
  '24px': {
    paddingHorizontal: '2px',
  },
  '36px': {
    paddingHorizontal: '8px',
  },
} satisfies Record<SelectHeight, BoxStyles>

export const textStylesForHeight = {
  '24px': {
    fontSize: '11px',
  },
  '36px': {
    fontSize: '15px',
  },
} satisfies Record<SelectHeight, TextStyles>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { placeholder, height = '36px', variant = 'solid', testId, ...selectProps },
    ref,
  ) => {
    return (
      <Box
        {...selectProps}
        as="select"
        borderWidth="1px"
        className={[
          backgroundStyle,
          heightStyles[height],
          disabledStyle,
          invalidStyle,
          styles.inlineText({
            ...textStylesForHeight[height],
          }),
        ]}
        placeholder={placeholder}
        testId={testId}
        width="full"
        {...stylesForVariant[variant]}
        {...stylesForHeight[height]}
        ref={ref}
      />
    )
  },
)
