import * as Accordion from '@radix-ui/react-accordion'
import {
  type AbiParameter,
  type AbiParameterToPrimitiveType,
  type AbiParametersToPrimitiveTypes,
} from 'abitype'
import React, { useEffect, useMemo, useState } from 'react'
import { type Hex, concat, decodeAbiParameters, stringify } from 'viem'

import { Tooltip } from '~/components'
import { Bleed, Box, SFSymbol, Text } from '~/design-system'
import { guessAbiItem, truncate } from '~/utils'

import * as styles from './DecodedAbiParameters.css'

export function DecodedAbiParameters<
  const TParams extends readonly AbiParameter[],
>({
  expandable = true,
  params,
  args,
  level = 0,
  variant,
}: {
  expandable?: boolean
  params: TParams
  args: TParams extends readonly AbiParameter[]
    ? AbiParametersToPrimitiveTypes<TParams>
    : never
  level?: number
  variant?: 'inline'
}) {
  return (
    <Accordion.Root className={styles.root} type="multiple">
      {params.map((param, index) => (
        <DecodedAbiParameter
          key={index}
          args={args}
          expandable={expandable}
          index={index}
          level={level}
          param={param}
          variant={variant}
        />
      ))}
    </Accordion.Root>
  )
}

export function DecodedAbiParameter<TAbiParameter extends AbiParameter>({
  args,
  expandable: expandable_,
  index = 0,
  level = 0,
  param: param_,
  variant,
}: {
  args: [AbiParameterToPrimitiveType<TAbiParameter>] | readonly unknown[]
  expandable?: boolean
  param: TAbiParameter
  level?: number
  index?: number
  variant?: 'inline'
}) {
  // TODO: Make truncate length responsive to element width.
  const truncateLength = 20

  const { guessed, param, value } = useMemo(() => {
    let guessed = false
    let param = param_
    let value = param.name
      ? args[param.name as any] ?? args[index]
      : args[index]

    // It could be possible that the bytes value is ABI encoded,
    // so we will try to decode it.
    if (param_.type === 'bytes') {
      try {
        const abiItem = guessAbiItem(concat(['0xdeadbeef', value as Hex]))
        if (
          'inputs' in abiItem &&
          abiItem.inputs &&
          abiItem.inputs.length > 1
        ) {
          guessed = true
          param = { ...param_, components: abiItem.inputs }
          value = decodeAbiParameters(abiItem.inputs, value as Hex)
        }
      } catch {}
    }

    return { guessed, param, value }
  }, [args, index, param_])

  const params = useMemo(() => {
    if (param.type?.includes('[') && Array.isArray(value)) {
      return value.map((_, i) => ({
        ...param,
        name: i.toString(),
        internalType: param.internalType?.replace(/\[\d?\]$/, ''),
        type: param.type.replace(/\[\d?\]$/, ''),
      }))
    }
    if ('components' in param) return param.components
    return undefined
  }, [param, value])

  const isExpandableParams = Boolean(params)

  const isExpandablePrimitive = useMemo(() => {
    if (params) return false
    if ((value ?? '').toString().length <= truncateLength) return false
    return true
  }, [params, value])

  const expandable =
    expandable_ && (isExpandableParams || isExpandablePrimitive)

  if (variant === 'inline')
    return (
      <Box className={styles.staticItem}>
        <ParameterRow level={level} value={value} variant="inline">
          <Text family="mono" size="11px" width="full" wrap="anywhere">
            <Text color="text/tertiary">
              {param.internalType || param.type} {param.name}{' '}
            </Text>
            {(value ?? '').toString()}
          </Text>
        </ParameterRow>
      </Box>
    )
  if (!expandable)
    return (
      <Box className={styles.staticItem}>
        <ParameterRow level={level} value={value}>
          <ParameterLabel
            index={index}
            param={param}
            truncateLength={truncateLength}
          />
          <Tooltip label={(value ?? '').toString()}>
            <ParameterValue value={value} truncateLength={truncateLength} />
          </Tooltip>
        </ParameterRow>
      </Box>
    )
  return (
    <Accordion.Item className={styles.item} value={`${index}`}>
      <ParameterTrigger>
        <ParameterRow expandable level={level} value={value}>
          <ParameterLabel
            index={index}
            param={param}
            truncateLength={truncateLength}
          />
          <ParameterValue value={value} truncateLength={truncateLength} />
        </ParameterRow>
      </ParameterTrigger>
      <Accordion.Content asChild>
        <Box className={styles.content}>
          {guessed && (
            <ParameterRow level={level + 1}>
              <Bleed bottom="-4px" top="-2px">
                <Text color="text/tertiary" size="11px">
                  Warning: We could not accurately decode the bytes component of
                  this parameter. The guessed parameters and values may be
                  incorrect.
                </Text>
              </Bleed>
            </ParameterRow>
          )}
          {isExpandableParams && params && (
            <DecodedAbiParameters
              params={params}
              args={value as readonly unknown[]}
              level={level + 1}
            />
          )}
          {isExpandablePrimitive && (
            <ParameterRow level={level + 1} value={value}>
              <Text
                align="left"
                family="mono"
                size="9px"
                width="full"
                wrap="anywhere"
              >
                {(value ?? '').toString()}
              </Text>
            </ParameterRow>
          )}
        </Box>
      </Accordion.Content>
    </Accordion.Item>
  )
}

function ParameterTrigger({
  children,
  disabled,
}: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <Accordion.Header asChild>
      <Accordion.Trigger className={styles.trigger} disabled={disabled} asChild>
        <Box as="button" tabIndex={disabled ? -1 : undefined} width="full">
          {children}
        </Box>
      </Accordion.Trigger>
    </Accordion.Header>
  )
}

export function ParameterRow({
  children,
  expandable,
  level,
  value,
  variant,
}: {
  children: React.ReactNode
  expandable?: boolean
  level: number
  value?: unknown
  variant?: 'inline'
}) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (copied) {
      navigator.clipboard.writeText(stringify(value).replace(/^"|"$/g, ''))
      setTimeout(() => setCopied(false), 1000)
    }
  }, [copied, value])

  return (
    <Box
      alignItems="center"
      className={styles.row}
      backgroundColor={{
        default: 'surface/primary/elevated',
        hover: value ? 'surface/fill/quarternary' : undefined,
      }}
      display="flex"
      onClick={value ? () => setCopied(true) : undefined}
      paddingHorizontal="12px"
      width="full"
    >
      <Indent level={level} />
      <Box
        display="flex"
        justifyContent="space-between"
        paddingVertical="8px"
        height="full"
        width={variant ? 'fit' : 'full'}
      >
        {children}
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        style={{ width: '16px' }}
      >
        {expandable ? (
          <SFSymbol
            className={styles.chevron}
            color="text/tertiary"
            size="9px"
            symbol="chevron.down"
            weight="medium"
          />
        ) : value ? (
          copied ? (
            <SFSymbol
              color="surface/green"
              size="9px"
              symbol="checkmark"
              weight="semibold"
            />
          ) : (
            <SFSymbol
              color="text/tertiary"
              size="9px"
              symbol="doc.on.doc"
              weight="medium"
            />
          )
        ) : null}
      </Box>
    </Box>
  )
}

export function Indent({ level }: { level: number }) {
  if (level === 0) return null
  return (
    <>
      {Array.from({ length: level }).map((_, i) => (
        <Box
          key={i}
          style={{
            minWidth: '12px',
            alignSelf: 'stretch',
          }}
        >
          <Box
            backgroundColor="surface/fill"
            style={{ width: '1px', height: '100%' }}
          />
        </Box>
      ))}
    </>
  )
}

function ParameterLabel({
  index,
  truncateLength,
  param,
}: {
  index: number
  truncateLength: number
  param: AbiParameter
}) {
  const internalTypeArray = param.internalType?.split('.').join('').split(' ')
  const internalType = internalTypeArray?.[internalTypeArray.length - 1]
  const label = `${internalType || param.type} ${
    param.name || index.toString()
  }`
  return (
    <Tooltip enabled={label.length > truncateLength} label={label}>
      <Box>
        <Text family="mono" size="11px">
          <Text color="text/tertiary">
            {internalType
              ? truncate(internalType, {
                  start: truncateLength / 2 - (param.name ? 6 : 2),
                  end: truncateLength / 2 - (param.name ? 6 : 2),
                })
              : param.type}
          </Text>{' '}
          {param.name
            ? truncate(param.name, {
                start: truncateLength / 2 - 4,
                end: truncateLength / 2 - 4,
              })
            : index.toString()}
        </Text>
      </Box>
    </Tooltip>
  )
}

function ParameterValue({
  truncateLength,
  value,
}: { truncateLength: number; value: unknown }) {
  if (Array.isArray(value))
    return <ArrayValue truncateLength={truncateLength} value={value} />
  if (typeof value === 'object' && value !== null)
    return <TupleValue truncateLength={truncateLength} value={value} />
  return <PrimitiveValue truncateLength={truncateLength} value={value} />
}

function PrimitiveValue({
  truncateLength,
  value,
}: { truncateLength: number; value: unknown }) {
  return (
    <Text family="mono" size="11px" wrap="anywhere">
      {truncate((value ?? '').toString(), {
        start: truncateLength / 2,
        end: truncateLength / 2,
      })}
    </Text>
  )
}

function ArrayValue({
  truncateLength,
  value,
}: { truncateLength: number; value: readonly unknown[] }) {
  if (!value) return null
  return (
    <Text family="mono" size="11px">
      <Text color="text/tertiary">[</Text>
      {value[0]
        ? truncate(stringify(value[0]), {
            start: truncateLength / 2 - 4,
            end: truncateLength / 2 - 4,
          })
        : ''}
      {value.length > 1 && (
        <Box display="inline">
          , <Text color="text/tertiary">x{value.length}</Text>
        </Box>
      )}
      <Text color="text/tertiary">]</Text>
    </Text>
  )
}

function TupleValue({
  truncateLength,
  value,
}: { truncateLength: number; value: object }) {
  return (
    <Text family="mono" size="11px">
      <Text color="text/tertiary">{'{'}</Text>
      {truncate(stringify(value), {
        start: truncateLength / 2,
        end: truncateLength / 2,
      }).replace(/^\{|\}$/g, '')}
      <Box display="inline">
        <Text color="text/tertiary">{'}'}</Text>
      </Box>
    </Text>
  )
}
