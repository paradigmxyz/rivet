import * as Accordion from '@radix-ui/react-accordion'
import type { AbiEvent } from 'abitype'
import { useMemo } from 'react'
import {
  DecodeLogTopicsMismatch,
  type Log,
  decodeEventLog,
  getAbiItem,
  parseAbiItem,
} from 'viem'

import {
  Bleed,
  Box,
  Column,
  Columns,
  Inset,
  SFSymbol,
  Stack,
  Text,
} from '~/design-system'
import { useAutoloadAbi } from '~/hooks/useAutoloadAbi'
import { useLookupSignature } from '~/hooks/useLookupSignature'
import { decodeEventLogs_guessed, truncate } from '~/utils'

import { LabelledContent } from '../LabelledContent'
import { DecodedAbiParameters, ParameterRow } from '../abi/DecodedAbiParameters'
import { FormattedAbiItem } from '../abi/FormattedAbiItem'

import * as styles from './DecodedLogs.css'

export function DecodedLogs({
  logs,
}: { logs: Log<bigint, number, boolean, AbiEvent>[] }) {
  return (
    <>
      <Box
        borderColor="surface/fill"
        borderBottomWidth="1px"
        display="flex"
        alignItems="center"
        style={{ height: '24px' }}
      >
        <Inset horizontal="8px">
          <Columns>
            <Column alignVertical="center" width="content">
              <Box style={{ width: '40px' }}>
                <Text color="text/tertiary" size="9px" wrap={false}>
                  INDEX
                </Text>
              </Box>
            </Column>
            <Column alignVertical="center" width="content">
              <Box style={{ width: '120px' }}>
                <Text color="text/tertiary" size="9px" wrap={false}>
                  ADDRESS
                </Text>
              </Box>
            </Column>
            <Column alignVertical="center">
              <Text color="text/tertiary" size="9px" wrap={false}>
                EVENT
              </Text>
            </Column>
          </Columns>
        </Inset>
      </Box>
      <Accordion.Root className={styles.root} type="multiple">
        {logs.map((log, i) => (
          <LogRow key={log.logIndex} index={i} log={log} />
        ))}
      </Accordion.Root>
    </>
  )
}

function LogRow({ index, log }: { index: number; log: Log }) {
  const selector = log.topics[0]

  // Try extract ABI from whatsabi autoloading.
  const { data: abi } = useAutoloadAbi({
    address: log.address,
    enabled: Boolean(log.address),
  })
  const autoloadAbiItem = useMemo(
    () =>
      abi && selector
        ? (getAbiItem({ abi, name: selector }) as AbiEvent)
        : undefined,
    [abi, selector],
  )

  // Extract signature from selector (for fall back).
  const { data: signature } = useLookupSignature({ selector })
  const signatureAbiItem = useMemo(
    () => (signature ? (parseAbiItem(`event ${signature}`) as AbiEvent) : null),
    [signature],
  )

  const abiItem = autoloadAbiItem || signatureAbiItem

  const args = useMemo(() => {
    if (!abiItem) return undefined

    try {
      // Try decode with provided indexed parameters.
      return decodeEventLog({
        abi: [abiItem],
        topics: log.topics,
        data: log.data,
      }).args
    } catch (err) {
      if (err instanceof DecodeLogTopicsMismatch) throw err

      // If decoding with given indexed parameters fail, try to guess the
      // positions of the indexed parameters
      return decodeEventLogs_guessed({
        abiItem,
        topics: log.topics,
        data: log.data,
      })?.args
    }
  }, [abiItem, log.data, log.topics])

  return (
    <Accordion.Item
      key={index}
      className={styles.item}
      value={log.logIndex?.toString() ?? index.toString()}
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
            style={{ height: '32px' }}
          >
            <Inset space="8px">
              <Columns>
                <Column alignVertical="center" width="content">
                  <Box style={{ width: '40px' }}>
                    <Text size="11px">{log.logIndex?.toString()}</Text>
                  </Box>
                </Column>
                <Column alignVertical="center" width="content">
                  <Box style={{ width: '120px' }}>
                    <Text size="11px">{truncate(log.address)}</Text>
                  </Box>
                </Column>
                <Column alignVertical="center">
                  <Text family="mono" size="11px" wrap={false}>
                    {abiItem ? (
                      <FormattedAbiItem
                        abiItem={abiItem}
                        compact
                        showIndexed={false}
                        showParameterNames={false}
                        showType={false}
                      />
                    ) : (
                      log.topics[0]
                    )}
                  </Text>
                </Column>
                <Column alignVertical="center" width="content">
                  <Box display="flex" paddingLeft="4px">
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
            <Stack gap="20px">
              <LabelledContent label="Address">
                <Text size="11px">{log.address}</Text>
              </LabelledContent>
              <Columns gap="16px">
                <Column width="content">
                  <LabelledContent label="Block">
                    <Text size="11px">{log.blockNumber?.toString()}</Text>
                  </LabelledContent>
                </Column>
                {log.transactionHash && (
                  <Column>
                    <LabelledContent label="Transaction Hash">
                      <Text.Truncated size="11px">
                        {log.transactionHash}
                      </Text.Truncated>
                    </LabelledContent>
                  </Column>
                )}
              </Columns>
              {!abiItem && (
                <Box backgroundColor="surface/yellowTint" padding="8px">
                  <Text size="11px">
                    Event was unable to be decoded. The contract's ABI or event
                    signature was not found in the database.
                  </Text>
                </Box>
              )}
              <LabelledContent label={`Event ${!abiItem ? 'Signature' : ''}`}>
                <Box
                  backgroundColor="surface/primary"
                  paddingHorizontal="8px"
                  paddingVertical="12px"
                >
                  {abiItem ? (
                    <FormattedAbiItem abiItem={abiItem} />
                  ) : (
                    <Text family="mono" size="11px">
                      {log.topics[0]}
                    </Text>
                  )}
                </Box>
              </LabelledContent>
              {args && (
                <LabelledContent label="Arguments">
                  <Bleed horizontal="-12px">
                    <DecodedAbiParameters
                      expandable={false}
                      params={abiItem?.type === 'event' ? abiItem.inputs : []}
                      args={(args || []) as any}
                    />
                  </Bleed>
                </LabelledContent>
              )}
              {!abiItem && (
                <LabelledContent label="Topics">
                  <Bleed horizontal="-12px">
                    {log.topics.map((topic, i) => (
                      <ParameterRow key={i} level={0} value={topic}>
                        <Text size="11px">
                          <Text color="text/tertiary">{i.toString()}:</Text>{' '}
                          {truncate(topic, { start: 16, end: 16 })}
                        </Text>
                      </ParameterRow>
                    ))}
                  </Bleed>
                </LabelledContent>
              )}
              {!abiItem && (
                <LabelledContent label="Data">
                  <Box
                    backgroundColor="surface/primary"
                    paddingHorizontal="8px"
                    paddingVertical="12px"
                  >
                    <Text family="mono" size="11px">
                      {log.data}
                    </Text>
                  </Box>
                </LabelledContent>
              )}
            </Stack>
          </Inset>
        </Box>
      </Accordion.Content>
    </Accordion.Item>
  )
}
