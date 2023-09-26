import { type InputHTMLAttributes, forwardRef } from 'react'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import {
  type InputHeight,
  type InputState,
  type InputVariant,
  backgroundStyle,
  disabledStyle,
  heightStyles,
  invalidStyle,
  placeholderStyle,
} from './Input.css'
import type { TextStyles } from './Text.css'
import * as styles from './Text.css'

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  keyof BoxStyles
> & {
  height?: InputHeight
  placeholder?: string
  testId?: string
  state?: InputState
  variant?: InputVariant
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
} satisfies Record<InputVariant, BoxStyles>

export const stylesForState = {
  warning: {
    borderColor: 'surface/yellow',
  },
  error: {
    borderColor: 'surface/red',
  },
} satisfies Record<InputState, BoxStyles>

export const stylesForHeight = {
  '24px': {
    paddingHorizontal: '6px',
  },
  '36px': {
    paddingHorizontal: '12px',
  },
} satisfies Record<InputHeight, BoxStyles>

export const textStylesForHeight = {
  '24px': {
    fontSize: '11px',
  },
  '36px': {
    fontSize: '15px',
  },
} satisfies Record<InputHeight, TextStyles>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      placeholder,
      height = '36px',
      state,
      variant = 'solid',
      testId,
      ...inputProps
    },
    ref,
  ) => {
    return (
      <Box
        {...inputProps}
        as="input"
        borderWidth="1px"
        className={[
          backgroundStyle,
          heightStyles[height],
          disabledStyle,
          invalidStyle,
          placeholderStyle,
          styles.inlineText({
            ...textStylesForHeight[height],
          }),
        ]}
        placeholder={placeholder}
        testId={testId}
        width="full"
        {...stylesForVariant[variant]}
        {...stylesForHeight[height]}
        {...(state && stylesForState[state])}
        ref={ref}
      />
    )
  },
)
