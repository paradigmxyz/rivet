import * as Form from '@radix-ui/react-form'
import type { UseFormRegister } from 'react-hook-form'

import { Box, Input, Stack, Text } from '~/design-system'
import type { InputProps } from '~/design-system/components/Input'

export type InputFieldProps = {
  defaultValue?: InputProps['defaultValue']
  innerRight?: React.ReactElement
  label: string
  min?: number
  register: ReturnType<UseFormRegister<any>>
  required?: boolean
  type?: InputProps['type']
}

export function InputField({
  defaultValue,
  innerRight,
  label,
  min,
  register,
  required,
  type,
}: InputFieldProps) {
  return (
    <Form.Field name={register.name}>
      <Stack gap='12px'>
        <Text color='text/tertiary' size='12px'>
          <Form.Label>{label}</Form.Label>
        </Text>
        <Box alignItems='center' display='flex' position='relative'>
          <Form.Control
            asChild
            {...register}
            defaultValue={defaultValue}
            min={min}
            required={required}
            type={type}
          >
            <Input />
          </Form.Control>
          {innerRight && (
            <Box right='12px' style={{ position: 'absolute' }}>
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
