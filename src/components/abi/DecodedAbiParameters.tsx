import * as Accordion from '@radix-ui/react-accordion'
import { type AbiParameter, type AbiParametersToPrimitiveTypes } from 'abitype'
import React, { useEffect, useState } from 'react'
import { stringify } from 'viem'

import { Tooltip } from '~/components'
import { Box, SFSymbol, Text } from '~/design-system'
import { truncate } from '~/utils'

import * as styles from './DecodedAbiParameters.css'

export function DecodedAbiParameters<
  const TParams extends readonly AbiParameter[],
>({
  params,
  args,
  level = 0,
}: {
  params: TParams
  args: TParams extends readonly AbiParameter[]
    ? AbiParametersToPrimitiveTypes<TParams>
    : never
  level?: number
}) {
  return (
    <Accordion.Root className={styles.root} type="multiple">
      {params.map((param, index) => {
        // TODO: Make truncate length responsive to element width.
        const truncateLength = 20

        const value = param.name
          ? args[param.name as any] ?? args[index]
          : args[index]

        const params = (() => {
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
        })()

        const isExpandableParams = Boolean(params)

        const isExpandablePrimitive = (() => {
          if (params) return false
          if ((value ?? '').toString().length <= truncateLength) return false
          return true
        })()

        const expandable = isExpandableParams || isExpandablePrimitive

        if (!expandable) {
          return (
            <Box className={styles.staticItem}>
              <ParameterRow level={level} value={value}>
                <ParameterLabel
                  index={index}
                  param={param}
                  truncateLength={truncateLength}
                />
                <ParameterValue value={value} truncateLength={truncateLength} />
              </ParameterRow>
            </Box>
          )
        }
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
      })}
    </Accordion.Root>
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

function ParameterRow({
  children,
  expandable,
  level,
  value,
}: {
  children: React.ReactNode
  expandable?: boolean
  level: number
  value: unknown
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
        hover: 'surface/fill/quarternary',
      }}
      display="flex"
      onClick={() => setCopied(true)}
      paddingHorizontal="12px"
      width="full"
    >
      <Indent level={level} />
      <Box
        display="flex"
        justifyContent="space-between"
        paddingVertical="8px"
        height="full"
        width="full"
      >
        {children}
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ width: '22px' }}
      >
        {expandable ? (
          <SFSymbol
            className={styles.chevron}
            color="text/tertiary"
            size="9px"
            symbol="chevron.down"
            weight="medium"
          />
        ) : copied ? (
          <SFSymbol
            color="surface/green"
            size="9px"
            symbol="checkmark"
            weight="semibold"
          />
        ) : (
          <SFSymbol
            color="text/quarternary"
            size="9px"
            symbol="doc.on.doc"
            weight="medium"
          />
        )}
      </Box>
    </Box>
  )
}

function Indent({ level }: { level: number }) {
  if (level === 0) return null
  return (
    <>
      {Array.from({ length: level }).map(() => (
        <Box
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
}: { index: number; truncateLength: number; param: AbiParameter }) {
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
    <Text family="mono" size="11px">
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
