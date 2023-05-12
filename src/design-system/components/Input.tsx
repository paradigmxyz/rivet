import { InputHTMLAttributes } from 'react'

import { Box } from './Box'
import { BoxStyles } from './Box.css'
import {
  InputHeight,
  InputVariant,
  backgroundStyle,
  heightStyles,
  placeholderStyle,
} from './Input.css'
import { TextStyles, textStyles } from './Text.css'

export type InputProps = {
  'aria-label'?: InputHTMLAttributes<HTMLInputElement>['aria-label']
  autoFocus?: InputHTMLAttributes<HTMLInputElement>['autoFocus']
  height?: InputHeight
  onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur']
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange']
  onFocus?: InputHTMLAttributes<HTMLInputElement>['onFocus']
  placeholder?: string
  testId?: string
  variant?: InputVariant
  value?: InputHTMLAttributes<HTMLInputElement>['value']
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
      as="input"
      borderWidth="1px"
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
      width="full"
      {...stylesForVariant[variant]}
      {...stylesForHeight[height]}
    />
  )
}
