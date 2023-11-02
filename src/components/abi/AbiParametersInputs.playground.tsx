import { FormProvider, useForm } from 'react-hook-form'

import { AbiParametersInputs as AbiParametersInputs_ } from '~/components'
import * as Form from '~/components/form'
import { Button, Stack } from '~/design-system'
import { normalizeAbiParametersValues } from '~/utils/normalizeAbiParametersValues'

const params = [
  {
    name: 'a',
    type: 'uint256',
  },
  {
    name: 'b',
    type: 'uint256[]',
  },
  {
    type: 'bool',
  },
  { name: 'c', type: 'bytes' },
  { name: 'd', type: 'address' },
  { name: 'e', type: 'bool' },
  { name: 'f', type: 'address[]' },
  {
    name: 'g',
    internalType: 'Baz',
    type: 'tuple',
    components: [
      { name: 'a', type: 'bytes' },
      { name: 'b', type: 'string' },
      { name: 'c', type: 'uint[]' },
    ],
  },
  {
    name: 'h',
    internalType: 'Baz',
    type: 'tuple',
    components: [
      { name: 'a', type: 'bytes' },
      { name: 'b', type: 'string' },
      { name: 'c', type: 'uint[]' },
      {
        name: 'd',
        internalType: 'Bar',
        type: 'tuple',
        components: [
          {
            name: 'a',
            type: 'bytes',
          },
        ],
      },
      {
        name: 'e',
        internalType: 'Baz[][]',
        type: 'tuple[][]',
        components: [
          { name: 'a', type: 'bytes' },
          { name: 'b', type: 'string' },
          {
            name: 'c',
            internalType: 'Baz[][]',
            type: 'tuple[][]',
            components: [
              { name: 'a', type: 'bytes' },
              { name: 'b', type: 'string' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'i',
    internalType: 'Baz[]',
    type: 'tuple[]',
    components: [
      { name: 'a', type: 'bytes' },
      { name: 'b', type: 'string' },
      { name: 'c', type: 'uint[]' },
      {
        name: 'd',
        internalType: 'Bar[]',
        type: 'tuple[]',
        components: [{ name: 'c', type: 'uint[]' }],
      },
    ],
  },
  {
    name: 'j',
    internalType: 'Baz[][]',
    type: 'tuple[][]',
    components: [
      { name: 'a', type: 'bytes' },
      { name: 'b', type: 'string' },
    ],
  },
  {
    name: 'k',
    internalType: 'Baz[][][]',
    type: 'tuple[][][]',
    components: [
      { name: 'a', type: 'bytes' },
      { name: 'b', type: 'string' },
    ],
  },
  {
    name: 'l',
    internalType: 'Baz',
    type: 'tuple[2][4]',
    components: [
      { name: 'a', type: 'bytes' },
      { name: 'b', type: 'string' },
      { name: 'c', type: 'uint[4]' },
      {
        name: 'd',
        internalType: 'Bar',
        type: 'tuple',
        components: [
          {
            name: 'a',
            type: 'bytes',
          },
        ],
      },
    ],
  },
  {
    name: 'm',
    type: 'string[][]',
  },
  {
    name: 'n',
    type: 'string[2][3]',
  },
  {
    name: 'o',
    type: 'string[2]',
  },
]

export function AbiParametersInputs() {
  const form = useForm()

  return (
    <FormProvider {...form}>
      <Form.Root
        onSubmit={form.handleSubmit((values) => {
          console.log(normalizeAbiParametersValues({ params, values }))
        })}
      >
        <Stack gap="8px">
          <AbiParametersInputs_ inputs={params} />
          <Button height="20px" type="submit">
            Submit
          </Button>
        </Stack>
      </Form.Root>
    </FormProvider>
  )
}
