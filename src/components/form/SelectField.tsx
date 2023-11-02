import * as Form from '@radix-ui/react-form'
import type { ReactNode } from 'react'
import type { UseFormRegister } from 'react-hook-form'

import { Select, Stack, Text } from '~/design-system'
import type { InputProps } from '~/design-system/components/Input'

export type SelectFieldProps = {
  children: ReactNode
  height?: InputProps['height']
  hideLabel?: boolean
  label: string
  register: ReturnType<UseFormRegister<any>>
}

export function SelectField({
  children,
  height,
  hideLabel,
  label,
  register,
}: SelectFieldProps) {
  return (
    <Form.Field name={register.name}>
      <Stack gap="12px">
        {hideLabel && (
          <Text color="text/tertiary" size="12px">
            <Form.Label>{label}</Form.Label>
          </Text>
        )}
        <Form.Control asChild {...register}>
          <Select height={height}>{children}</Select>
        </Form.Control>
      </Stack>
    </Form.Field>
  )
}
