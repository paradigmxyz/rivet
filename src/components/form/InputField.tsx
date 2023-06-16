import * as Form from '@radix-ui/react-form'
import { useRef } from 'react'
import type { UseFormRegister } from 'react-hook-form'

import { Box, Input, Stack, Text } from '~/design-system'
import type { InputProps } from '~/design-system/components/Input'

export type InputFieldProps = {
  defaultValue?: InputProps['defaultValue']
  innerLeft?: React.ReactElement
  innerRight?: React.ReactElement
  label: string
  min?: number
  register: ReturnType<UseFormRegister<any>>
  required?: boolean
  type?: InputProps['type']
}

export function InputField({
  defaultValue,
  innerLeft,
  innerRight,
  label,
  min,
  register,
  required,
  type,
}: InputFieldProps) {
  const innerRightRef = useRef<HTMLDivElement>(null)
  const innerRightWidth = innerRightRef.current?.clientWidth

  const innerLeftRef = useRef<HTMLDivElement>(null)
  const innerLeftWidth = innerLeftRef.current?.clientWidth

  return (
    <Form.Field name={register.name}>
      <Stack gap='12px'>
        <Text color='text/tertiary' size='12px'>
          <Form.Label>{label}</Form.Label>
        </Text>
        <Box alignItems='center' display='flex' position='relative'>
          {innerLeft && (
            <Box
              ref={innerLeftRef}
              left='12px'
              style={{ position: 'absolute' }}
            >
              {innerLeft}
            </Box>
          )}
          <Form.Control
            asChild
            {...register}
            defaultValue={defaultValue}
            min={min}
            required={required}
            type={type}
          >
            <Input
              style={{
                paddingLeft: (innerLeftWidth || 0) + 12,
                paddingRight: (innerRightWidth || 0) + 12,
              }}
            />
          </Form.Control>
          {innerRight && (
            <Box
              ref={innerRightRef}
              right='12px'
              style={{ position: 'absolute' }}
            >
              {innerRight}
            </Box>
          )}
        </Box>
        <Form.Message match='valueMissing'>
          <Text color='surface/red' size='12px'>
            {label} is required
          </Text>
        </Form.Message>
        <Form.Message match='rangeUnderflow'>
          <Text color='surface/red' size='12px'>
            {label} must be greater than {min}
          </Text>
        </Form.Message>
      </Stack>
    </Form.Field>
  )
}
