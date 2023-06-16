import * as Form from '@radix-ui/react-form'
import type { UseFormRegister } from 'react-hook-form'

import { Box, Inline, Inset, Text } from '~/design-system'

export type CheckboxFieldProps = {
  label: string
  register: ReturnType<UseFormRegister<any>>
}

export function CheckboxField({ label, register }: CheckboxFieldProps) {
  return (
    <Form.Field name={register.name}>
      <Inset bottom='2px'>
        <Inline alignVertical='center' gap='4px'>
          <Form.Control asChild {...register}>
            <Box as='input' type='checkbox' />
          </Form.Control>
          <Form.Label>
            <Text color='text/tertiary' size='12px'>
              {label}
            </Text>
          </Form.Label>
        </Inline>
      </Inset>
    </Form.Field>
  )
}
