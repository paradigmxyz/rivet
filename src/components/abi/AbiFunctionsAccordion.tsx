import * as Accordion from '@radix-ui/react-accordion'
import {
  type Abi,
  type AbiFunction,
  type AbiParameter,
  type Address,
  formatAbiItem,
} from 'abitype'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { type Hex, decodeAbiParameters, getFunctionSelector } from 'viem'

import * as Form from '~/components/form'
import {
  Bleed,
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Inset,
  Link,
  SFSymbol,
  Stack,
  Text,
} from '~/design-system'
import { useCalldataAbi } from '~/hooks/useCalldataAbi'
import { useReadContract } from '~/hooks/useReadContract'
import { useWriteContract } from '~/hooks/useWriteContract'
import { normalizeAbiParametersValues } from '~/utils'
import { useAccountStore } from '~/zustand'

import { LabelledContent } from '../LabelledContent'
import * as styles from './AbiFunctionsAccordion.css'
import { AbiParametersInputs } from './AbiParametersInputs'
import { DecodedAbiParameters } from './DecodedAbiParameters'
import { FormattedAbiItem } from './FormattedAbiItem'

export function AbiFunctionsAccordion({
  abi,
  address,
}: {
  abi: AbiFunction[]
  address: Address
}) {
  return (
    <Accordion.Root className={styles.root} type="multiple">
      {abi?.map((abiItem) => (
        <Accordion.Item
          key={formatAbiItem(abiItem)}
          className={styles.item}
          value={formatAbiItem(abiItem)}
        >
          <Accordion.Header asChild>
            <Accordion.Trigger asChild className={styles.trigger}>
              <Box
                as="button"
                alignItems="center"
                backgroundColor={{
                  hover: 'surface/fill/quarternary',
                }}
                className={styles.row}
                display="flex"
                width="full"
                style={{ height: '24px' }}
              >
                <Inset space="8px">
                  <Columns>
                    <Column>
                      <FormattedAbiItem
                        abiItem={abiItem}
                        compact
                        showIndexed={false}
                        showParameterNames={false}
                        showReturns={false}
                        showStateMutability={false}
                        showType={false}
                        wrap={false}
                      />
                    </Column>
                    <Column alignVertical="center" width="content">
                      <Box display="flex">
                        <SFSymbol
                          className={styles.chevron}
                          color="text/tertiary"
                          size="9px"
                          symbol="chevron.down"
                          weight="medium"
                        />
                      </Box>
                    </Column>
                  </Columns>
                </Inset>
              </Box>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content asChild>
            <Box className={styles.content}>
              <Inset space="8px">
                <AbiFunctionContent abiFunction={abiItem} address={address} />
              </Inset>
            </Box>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

export function AbiFunctionContent({
  abiFunction,
  address,
}: { abiFunction: AbiFunction; address: Address }) {
  type Type = 'read' | 'write' | 'unknown'
  const [type, setType] = useState<Type>(() => {
    if (abiFunction.stateMutability === 'view') return 'read'
    if (abiFunction.stateMutability === 'pure') return 'read'
    if (abiFunction.stateMutability === 'nonpayable') return 'write'
    if (abiFunction.stateMutability === 'payable') return 'write'
    if (abiFunction.payable) return 'write'
    return 'unknown'
  })
  const isRead = type === 'read'
  const isWrite = type === 'write'
  const isUnknown =
    type === 'unknown' || (!abiFunction.stateMutability && !abiFunction.payable)

  const { account } = useAccountStore()

  const form = useForm({ mode: 'onBlur' })
  const { formState, handleSubmit, watch } = form

  const [args, setArgs] = useState<readonly unknown[] | undefined>(undefined)
  const [isReadEnabled, setReadEnabled] = useState(false)
  const { data, error, isLoading, isRefetching, refetch } = useReadContract({
    address,
    abi: [abiFunction] as Abi,
    enabled:
      isReadEnabled ||
      Boolean(args && args.length > 0) ||
      Boolean(abiFunction.inputs.length === 0 && isRead),
    functionName: abiFunction.name,
    args,
    raw: isUnknown,
  })

  const [hash, setHash] = useState<string | undefined>()
  const { data: hash_, mutateAsync } = useWriteContract()

  const invoke = async ({ type }: { type: Type }) => {
    await form.trigger()

    const params = abiFunction.inputs || []
    if (params.length > 0 && !form.formState.isValid) return

    const values = form.getValues()
    const args = normalizeAbiParametersValues({
      params,
      values,
    })

    setType(type)

    if (type === 'write') {
      await mutateAsync({
        abi: [abiFunction] as Abi,
        address,
        account,
        functionName: abiFunction.name,
        args,
      })
    } else {
      if (params.length > 0 && args) setArgs(args)
      else setReadEnabled(true)
    }
  }

  const submit = handleSubmit(() =>
    invoke({ type: isWrite ? 'write' : 'read' }),
  )

  useEffect(() => {
    if (hash_) setHash(hash_)
  }, [hash_])

  useEffect(() => {
    const subscription = watch(() => {
      if (formState.isSubmitted) setArgs(undefined)
    })
    return subscription.unsubscribe
  }, [formState, watch])

  return (
    <Stack gap="16px">
      <Stack gap="8px">
        <LabelledContent label="Signature">
          <Box
            backgroundColor="surface/primary"
            paddingHorizontal="8px"
            paddingVertical="12px"
          >
            <FormattedAbiItem abiItem={abiFunction} />
          </Box>
        </LabelledContent>
        <FormProvider {...form}>
          <Form.Root onSubmit={submit}>
            <Stack gap="8px">
              {abiFunction.inputs?.length > 0 && (
                <AbiParametersInputs inputs={abiFunction.inputs} />
              )}
              {isUnknown ? (
                <Inline gap="4px">
                  <Button
                    height="24px"
                    onClick={() => invoke({ type: 'read' })}
                    variant="stroked fill"
                    width="fit"
                    type="button"
                  >
                    Read
                  </Button>
                  <Button
                    height="24px"
                    onClick={() => invoke({ type: 'write' })}
                    variant="stroked fill"
                    width="fit"
                    type="button"
                  >
                    Write
                  </Button>
                </Inline>
              ) : isWrite || abiFunction.inputs?.length > 0 ? (
                <Button
                  height="24px"
                  variant="stroked fill"
                  width="fit"
                  type="submit"
                >
                  Execute
                </Button>
              ) : null}
            </Stack>
          </Form.Root>
        </FormProvider>
      </Stack>
      {isWrite && hash && (
        <>
          <LabelledContent label="Result">
            <Inline alignVertical="center" gap="4px">
              <Text size="11px">Success</Text>
            </Inline>
          </LabelledContent>
          <LabelledContent label="Transaction Hash">
            <Link to={`/transaction/${hash}`}>
              <Text.Truncated size="11px">{hash}</Text.Truncated>
            </Link>
          </LabelledContent>
        </>
      )}
      {isRead && (
        <>
          {isLoading && (
            <Bleed top="-4px">
              <Text color="text/tertiary" size="11px">
                Loading...
              </Text>
            </Bleed>
          )}
          {typeof data !== 'undefined' && (
            <LabelledContent
              label={
                <Box position="relative" width="fit">
                  <Text color="text/tertiary" size="9px">
                    RESULT
                  </Text>
                  <Box
                    position="absolute"
                    top="0px"
                    style={{ right: -16, top: -6 }}
                  >
                    <Button.Symbol
                      disabled={isRefetching}
                      onClick={() => refetch()}
                      variant="ghost primary"
                      label="Refetch"
                      symbol="arrow.clockwise"
                      height="16px"
                    />
                  </Box>
                </Box>
              }
            >
              <Bleed horizontal="-12px" top="-4px" bottom="-4px">
                {isUnknown ? (
                  <CalldataResult
                    abiFunction={abiFunction}
                    data={data as Hex}
                  />
                ) : (
                  <Result outputs={abiFunction.outputs} value={data} />
                )}
              </Bleed>
            </LabelledContent>
          )}
          {error && (
            <LabelledContent label="Error">
              <Inset top="4px">
                <Text size="11px">
                  {(error as any).shortMessage || error.message}
                </Text>
              </Inset>
            </LabelledContent>
          )}
        </>
      )}
    </Stack>
  )
}

function CalldataResult({
  abiFunction,
  data,
}: { abiFunction: AbiFunction; data: Hex }) {
  const abi = useCalldataAbi({
    data: `${getFunctionSelector(abiFunction)}${data.slice(2)}`,
  })
  if (!abi) return data

  const abiItem = abi[0] as AbiFunction
  const value = useMemo(() => {
    try {
      return decodeAbiParameters(abiItem.inputs, data)
    } catch {}
  }, [abi, data])

  return <Result outputs={abiItem.inputs as AbiParameter[]} value={value} />
}

function Result({
  outputs,
  value,
}: { outputs: AbiFunction['outputs']; value: unknown }) {
  if (Array.isArray(value) || (typeof value === 'object' && value !== null))
    return <DecodedAbiParameters params={outputs} args={value as any} />
  return (
    <DecodedAbiParameters
      expandable={false}
      params={outputs}
      args={[value]}
      variant="inline"
    />
  )
}
