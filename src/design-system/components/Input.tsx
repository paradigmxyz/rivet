import type { InputHTMLAttributes } from 'react'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import {
  type InputHeight,
  type InputVariant,
  backgroundStyle,
  heightStyles,
  placeholderStyle,
} from './Input.css'
import { type TextStyles, textStyles } from './Text.css'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, keyof BoxStyles> & {
  height?: InputHeight
  placeholder?: string
  testId?: string
  variant?: InputVariant
}

export const stylesForVariant = {
  solid: {
    backgroundColor: {
      default: 'body / 0.5',
    },
    borderColor: {
      default: 'primary / 0.2',
      hover: 'primary / 0.3',
      focus: 'primary',
      hoverfocus: 'primary',
    },
  },
} satisfies Record<InputVariant, BoxStyles>

export const stylesForHeight = {
  '36px': {
    paddingHorizontal: '12px',
  },
} satisfies Record<InputHeight, BoxStyles>

export const textStylesForHeight = {
  '36px': {
    fontSize: '15px',
  },
} satisfies Record<InputHeight, TextStyles>

export function Input({
  placeholder,
  height = '36px',
  variant = 'solid',
  testId,
  ...inputProps
}: InputProps) {
  return (
    <Box
      {...inputProps}
      as='input'
      borderWidth='1px'
      className={[
        backgroundStyle,
        heightStyles[height],
        textStyles({
          ...textStylesForHeight[height],
        }),
        placeholderStyle,
      ]}
      placeholder={placeholder}
      testId={testId}
      width='full'
      {...stylesForVariant[variant]}
      {...stylesForHeight[height]}
    />
  )
}
