import type { AbiFunction, AbiParameter } from 'abitype'
import { useEffect, useMemo } from 'react'
import {
  type RegisterOptions,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'

import * as Form from '~/components/form'
import {
  Bleed,
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Stack,
  Text,
} from '~/design-system'
import { Indent } from './DecodedAbiParameters'
import { ParameterType } from './FormattedAbiItem'

export type AbiParameterInputsProps = {
  inputs: AbiFunction['inputs']
}

export function AbiParametersInputs(props: AbiParameterInputsProps) {
  return <AbiParametersInputsInner {...props} />
}

function AbiParametersInputsInner({
  inputs,
  level = 0,
  namePrefix,
  parentType,
}: AbiParameterInputsProps & {
  level?: number
  namePrefix?: string
  parentType?: string
}) {
  return (
    <Stack gap="4px">
      {inputs.map((input, index) => (
        <AbiParametersInputsRow
          key={index}
          level={level}
          index={index}
          input={input}
          namePrefix={namePrefix}
          parentType={parentType}
        />
      ))}
    </Stack>
  )
}

function AbiParametersInputsRow({
  index,
  input,
  level = 0,
  namePrefix = '',
  parentType,
}: {
  index: number
  input: AbiParameter
  level?: number
  namePrefix?: string
  parentType?: string
}) {
  const arrayMatches = input.type.match(/^(.*)\[(\d+)?\]$/)
  const arrayLength = arrayMatches?.[2]

  const childType = getArrayChildType(input.type)
  const childInternalType = input.internalType
    ? getArrayChildType(input.internalType)
    : undefined

  const isArray = Boolean(arrayMatches)
  const isParentArray = isArrayType(parentType)
  const isChildArray = isArrayType(childType)

  const isTuple = isTupleType(input.type)
  const isParentTuple = isTupleType(parentType)

  const isPrimitiveLeaf = !isTuple && !isChildArray
  const isEdge = isParentArray && (isParentTuple ? !isPrimitiveLeaf : true)

  let name = ''
  if (namePrefix) name += namePrefix
  if (namePrefix && !isEdge) name += '.'
  if (!isEdge) name += input.name || index.toString()

  const label = name || index.toString()

  const { append, fields, remove } = useFieldArray({
    name: isArray ? name : '__noop',
  })

  useEffect(() => {
    if (!isArray) return
    if (isPrimitiveLeaf && isParentTuple && !arrayLength) return

    if (arrayLength) {
      const length =
        Number(arrayLength) - (isPrimitiveLeaf && !parentType ? 1 : 0)
      setTimeout(() => {
        for (let i = 0; i < length; i++) append({ _value: '' })
      }, 32)
    } else append({ _value: '' })
  }, [append, arrayLength, isArray, isPrimitiveLeaf, isParentTuple, parentType])

  return (
    <>
      <Columns alignVertical="center" gap="8px">
        <Column>
          <Label
            name={isEdge ? getEdgeName(name) : input.name || index.toString()}
            type={input.internalType || input.type}
          />
        </Column>
        <Column>
          {isPrimitiveLeaf && (
            <Box
              alignItems="center"
              display="flex"
              position="relative"
              style={{ height: '28px' }}
            >
              {isArray && fields.length <= 1 && (
                <Box position="absolute" style={{ left: -24, top: 4 }}>
                  <AddItemButton onClick={() => append({ _value: '' })} />
                </Box>
              )}
              <Box width="full">
                <PrimitiveParameterInput
                  key={isArray ? fields[0]?.id : undefined}
                  label={label}
                  name={isArray ? `${name}[0]._value` : name}
                  type={childType}
                />
              </Box>
            </Box>
          )}
        </Column>
      </Columns>
      {isTuple && !isArray && 'components' in input && (
        <Box display="flex">
          <Indent level={1} />
          <AbiParametersInputsInner
            level={level + 1}
            inputs={input.components}
            namePrefix={isArray ? `${name}[0]` : name}
            parentType={input.type}
          />
        </Box>
      )}
      {isArray && (
        <>
          {isPrimitiveLeaf &&
            fields.length > 1 &&
            fields.map((field, index) =>
              index === 0 ? null : (
                <Columns alignVertical="center" gap="8px" key={field.id}>
                  <Column />
                  <Column alignHorizontal="right">
                    <Box position="relative" width="full">
                      {!arrayLength && (
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          position="absolute"
                          style={{ left: -44, top: 2, width: 40 }}
                        >
                          {index === fields.length - 1 && (
                            <AddItemButton
                              onClick={() => append({ _value: '' })}
                            />
                          )}
                          <RemoveItemButton onClick={() => remove(index)} />
                        </Box>
                      )}
                      <PrimitiveParameterInput
                        label={label}
                        name={`${name}[${index}]._value`}
                        type={childType}
                      />
                    </Box>
                  </Column>
                </Columns>
              ),
            )}
          {!isPrimitiveLeaf &&
            fields.map((field, index) => (
              <Box display="flex" key={field.id}>
                <Indent level={1} />
                <Stack gap="2px" width="full">
                  <AbiParametersInputsInner
                    level={level + 1}
                    inputs={[
                      {
                        ...('components' in input
                          ? { components: input.components }
                          : {}),
                        internalType: childInternalType,
                        type: childType,
                      },
                    ]}
                    namePrefix={`${name}[${index}]`}
                    parentType={input.type}
                  />
                  {!arrayLength && (
                    <Bleed horizontal="-2px">
                      <Inline gap="2px">
                        {fields.length > 1 && (
                          <RemoveItemButton onClick={() => remove(index)} />
                        )}
                        {index === fields.length - 1 && (
                          <AddItemButton
                            onClick={() => append({ _value: '' })}
                          />
                        )}
                      </Inline>
                    </Bleed>
                  )}
                </Stack>
              </Box>
            ))}
        </>
      )}
    </>
  )
}

function Label({ name, type }: { name: string; type: string }) {
  return (
    <Box alignItems="center" display="flex" style={{ height: '28px' }}>
      <Stack gap="6px">
        <Text family="mono" size="11px" wrap={false}>
          {name}
        </Text>
        <Text family="mono" size="9px">
          <ParameterType type={type} />
        </Text>
      </Stack>
    </Box>
  )
}

function PrimitiveParameterInput({
  label,
  name,
  type,
}: {
  label: string
  name: string
  type: string
}) {
  if (type === 'bool')
    return <BooleanParameterInput label={label} name={name} />
  return <TextParameterInput label={label} name={name} type={type} />
}

function TextParameterInput({
  label,
  name,
  type,
}: {
  label: string
  name: string
  type: string
}) {
  const { formState, register } = useFormContext()

  const error = formState.errors[name]

  const placeholder = useMemo(() => {
    if (type === 'address') return '0x0000000000000000000000000000000000000000'
    if (type.startsWith('bytes')) return '0xdeadbeef'
    if (type.startsWith('int') || type.startsWith('uint')) return '69420'
    if (type === 'string') return 'Hello world'
    return ''
  }, [type])

  const registerOptions = useMemo(() => {
    const options: RegisterOptions = {
      required: {
        message: 'Must not be empty',
        value: true,
      },
    }
    if (type === 'address')
      options.pattern = {
        message: 'Must be an address',
        value: /^0x[0-9a-fA-F]{40}$/,
      }
    if (type.startsWith('bytes'))
      // TODO: handle bytesN validation.
      options.pattern = {
        message: 'Must be a hex string',
        value: /^0x[0-9a-fA-F]*$/,
      }
    if (type.startsWith('int') || type.startsWith('uint'))
      // TODO: handle u?intN validation.
      options.pattern = {
        message: 'Must be a number',
        value: /^[0-9]+$/,
      }
    return options
  }, [type])

  return (
    <Form.InputField
      errorMessage={error?.message as string}
      height="24px"
      hideLabel
      label={label}
      placeholder={placeholder}
      register={register(name, registerOptions)}
      state={error ? 'error' : undefined}
    />
  )
}

function BooleanParameterInput({
  label,
  name,
}: {
  label: string
  name: string
}) {
  const { register } = useFormContext()

  return (
    <Form.SelectField height="24px" label={label} register={register(name)}>
      <option>false</option>
      <option>true</option>
    </Form.SelectField>
  )
}

function AddItemButton({ onClick }: { onClick: () => void }) {
  return (
    <Button.Symbol
      onClick={onClick}
      height="20px"
      variant="ghost primary"
      label="Add item"
      symbol="plus"
    />
  )
}

function RemoveItemButton({ onClick }: { onClick: () => void }) {
  return (
    <Button.Symbol
      onClick={onClick}
      height="20px"
      variant="ghost red"
      label="Remove item"
      symbol="minus"
    />
  )
}

function getArrayChildType(type: string) {
  return type.replace(/\[\d*\]$/, '')
}

function getEdgeName(name: string) {
  return name.split('.').slice(-1)[0]
}

function isArrayType(type?: string) {
  if (!type) return false
  return Boolean(type.match(/\[\d*\]$/))
}

function isTupleType(type?: string) {
  if (!type) return false
  return type.startsWith('tuple')
}
