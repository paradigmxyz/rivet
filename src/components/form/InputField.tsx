import * as Form from '@radix-ui/react-form'
import { useRef } from 'react'
import type { FormState, UseFormRegister } from 'react-hook-form'

import { Box, Input, Stack, Text } from '~/design-system'
import type { InputProps } from '~/design-system/components/Input'

export type InputFieldProps = Form.FormControlProps & {
  defaultValue?: InputProps['defaultValue']
  formState?: FormState<any>
  height?: InputProps['height']
  hideLabel?: boolean
  hint?: React.ReactNode | string
  innerLeft?: React.ReactElement
  innerRight?: React.ReactElement
  label: string
  min?: number
  name?: string
  placeholder?: InputProps['placeholder']
  register?: ReturnType<UseFormRegister<any>>
  required?: boolean
  state?: InputProps['state']
  style?: any
  type?: InputProps['type']
}

export function InputField({
  defaultValue,
  height,
  hideLabel,
  hint,
  innerLeft,
  innerRight,
  label,
  min,
  name,
  placeholder,
  register,
  required,
  style,
  type,
  ...formControlProps
}: InputFieldProps) {
  const innerRightRef = useRef<HTMLDivElement>(null)
  const innerRightWidth = innerRightRef.current?.clientWidth

  const innerLeftRef = useRef<HTMLDivElement>(null)
  const innerLeftWidth = innerLeftRef.current?.clientWidth

  return (
    <Form.Field asChild name={name || register?.name || ''}>
      <Box width="full" style={style}>
        <Stack gap="12px">
          {!hideLabel && (
            <Text color="text/tertiary" size="12px">
              <Form.Label>{label}</Form.Label>
            </Text>
          )}
          <Stack gap="8px">
            <Box alignItems="center" display="flex" position="relative">
              {innerLeft && (
                <Box
                  ref={innerLeftRef}
                  left="12px"
                  style={{ position: 'absolute' }}
                >
                  {innerLeft}
                </Box>
              )}
              <Form.Control
                asChild
                {...formControlProps}
                {...register}
                defaultValue={defaultValue}
                min={min}
                required={required}
                type={type}
              >
                <Input
                  height={height}
                  placeholder={placeholder}
                  style={{
                    paddingLeft: innerLeft
                      ? (innerLeftWidth || 0) + 12
                      : undefined,
                    paddingRight: innerRight
                      ? (innerRightWidth || 0) + 12
                      : undefined,
                  }}
                />
              </Form.Control>
              {innerRight && (
                <Box
                  ref={innerRightRef}
                  right="12px"
                  style={{ position: 'absolute' }}
                >
                  {innerRight}
                </Box>
              )}
            </Box>
            <Form.Message match="valueMissing">
              <Text color="surface/red" size="12px">
                {label} is required
              </Text>
            </Form.Message>
            <Form.Message match="rangeUnderflow">
              <Text color="surface/red" size="12px">
                {label} must be greater than {min}
              </Text>
            </Form.Message>
            {typeof hint === 'string' ? <Text size="12px">{hint}</Text> : hint}
          </Stack>
        </Stack>
      </Box>
    </Form.Field>
  )
}
