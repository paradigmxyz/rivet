import * as Tabs from '@radix-ui/react-tabs'
import type { AbiEvent } from 'abitype'
import { Fragment, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { type Hash, type Log, formatEther, formatGwei, hexToBigInt } from 'viem'

import {
  Container,
  DecodedCalldata,
  DecodedLogs,
  LabelledContent,
  TabsContent,
  TabsList,
  Tooltip,
} from '~/components'
import {
  Bleed,
  Box,
  Column,
  Columns,
  Inline,
  Inset,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useBlock } from '~/hooks/useBlock'
import { useTransaction } from '~/hooks/useTransaction'
import { useTransactionConfirmations } from '~/hooks/useTransactionConfirmations'
import { useTransactionReceipt } from '~/hooks/useTransactionReceipt'
import { capitalize } from '~/utils'
import { FormattedAbiFunctionName } from '../components/abi/FormattedAbiFunctionName'
import { useBatchCallsStore } from '../zustand/batch-calls'

const numberIntl = new Intl.NumberFormat()
const numberIntl4SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 4,
})

export default function TransactionDetails() {
  const { transactionHash } = useParams()
  const [params] = useSearchParams()

  const { data: transaction } = useTransaction({
    hash: transactionHash as Hash,
  })
  const {
    data: receipt,
    isLoading: isReceiptLoading,
    isSuccess: isReceiptSuccess,
  } = useTransactionReceipt({
    hash: transaction?.hash as Hash,
  })
  const { data: confirmations } = useTransactionConfirmations({
    hash: receipt?.transactionHash as Hash,
  })
  const { data: block } = useBlock({ blockNumber: transaction?.blockNumber })

  const { getBatchFromTransactionHash } = useBatchCallsStore()
  const calls = useMemo(() => {
    if (!receipt?.transactionHash) return null
    const batch = getBatchFromTransactionHash(receipt.transactionHash)
    if (!batch) return null
    return batch.calls.map((call, i) => ({
      ...call,
      hash: batch.transactionHashes[i],
    }))
  }, [getBatchFromTransactionHash, receipt?.transactionHash])

  if (!transaction) return null
  return (
    <>
      <Container dismissable header={'Transaction Details'}>
        <Stack gap="20px">
          <Columns gap="12px">
            <Column width="1/3">
              <LabelledContent label="Hash">
                <Tooltip label={<Text size="9px">{transaction.hash}</Text>}>
                  <Text.Truncated size="12px">
                    {transaction.hash!.toString()}
                  </Text.Truncated>
                </Tooltip>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="Status">
                {isReceiptSuccess && (
                  <Inline gap="4px" wrap={false}>
                    <Box
                      backgroundColor={
                        receipt?.status === 'success'
                          ? 'surface/green'
                          : receipt?.status === 'reverted'
                            ? 'surface/red'
                            : 'surface/invert@0.5'
                      }
                      borderWidth="1px"
                      borderRadius="round"
                      style={{ minWidth: 8, minHeight: 8 }}
                    />
                    {!transaction.blockNumber ? (
                      <Text color="text/tertiary" size="12px">
                        Pending
                      </Text>
                    ) : (
                      <Text size="12px">
                        {receipt?.status ? capitalize(receipt?.status) : ''}
                      </Text>
                    )}
                  </Inline>
                )}
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="Nonce">
                <Text size="12px">{transaction.nonce}</Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Columns gap="12px">
            <Column width="1/3">
              <LabelledContent label="From">
                <Tooltip label={transaction.from}>
                  <Text.Truncated size="12px">
                    {transaction.from}
                  </Text.Truncated>
                </Tooltip>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              {transaction.to && (
                <LabelledContent label="To">
                  <Tooltip label={transaction.to}>
                    <Text.Truncated size="12px">
                      {transaction.to}
                    </Text.Truncated>
                  </Tooltip>
                </LabelledContent>
              )}
              {receipt?.contractAddress && (
                <LabelledContent label="Contract">
                  <Tooltip label={receipt.contractAddress}>
                    <Text.Truncated size="12px">
                      {receipt.contractAddress}
                    </Text.Truncated>
                  </Tooltip>
                </LabelledContent>
              )}
            </Column>
            <Column width="1/3">
              <LabelledContent label="Value">
                <Text size="12px">
                  {numberIntl4SigFigs.format(
                    Number(formatEther(transaction.value!)),
                  )}{' '}
                  <Text color="text/tertiary">ETH</Text>
                </Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Separator />
          {block?.timestamp ? (
            <>
              <Columns gap="12px">
                <Column width="1/3">
                  <LabelledContent label="Block">
                    <Stack gap="6px">
                      <Text size="12px">{receipt?.blockNumber.toString()}</Text>
                      <Text color="text/tertiary" size="9px">
                        {confirmations?.toString()} Confirmations
                      </Text>
                    </Stack>
                  </LabelledContent>
                </Column>
                <Column>
                  <LabelledContent label="Timestamp">
                    <Text size="12px">
                      {new Date(
                        Number(block?.timestamp! * 1000n),
                      ).toLocaleString()}
                    </Text>
                  </LabelledContent>
                </Column>
              </Columns>
              <Separator />
            </>
          ) : null}
          <Columns gap="12px">
            <Column width="1/4">
              <LabelledContent label="Type">
                <Text size="12px">{transaction.type}</Text>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              {transaction.type === 'eip1559' ? (
                <LabelledContent label="Tip/Max Fee Per Gas">
                  <Text size="12px">
                    {transaction.maxPriorityFeePerGas
                      ? `${numberIntl.format(
                          Number(formatGwei(transaction.maxPriorityFeePerGas)),
                        )}`
                      : '0'}
                    /
                    {transaction.maxFeePerGas
                      ? `${numberIntl.format(
                          Number(formatGwei(transaction.maxFeePerGas)),
                        )}`
                      : null}{' '}
                    <Text color="text/tertiary">gwei</Text>
                  </Text>
                </LabelledContent>
              ) : (
                <LabelledContent label="Gas Price">
                  <Text size="12px">
                    {transaction.gasPrice ? (
                      <>
                        {numberIntl.format(
                          Number(formatGwei(transaction.gasPrice)),
                        )}{' '}
                        <Text color="text/tertiary">gwei</Text>
                      </>
                    ) : null}
                  </Text>
                </LabelledContent>
              )}
            </Column>
            {receipt && transaction.type === 'eip1559' && (
              <Column width="1/3">
                <LabelledContent label="Actual Fee Per Gas">
                  <Text size="12px">
                    {receipt.effectiveGasPrice ? (
                      <>
                        {numberIntl.format(
                          Number(formatGwei(receipt.effectiveGasPrice)),
                        )}{' '}
                        <Text color="text/tertiary">gwei</Text>
                      </>
                    ) : null}
                  </Text>
                </LabelledContent>
              </Column>
            )}
          </Columns>
          <Columns gap="12px">
            <Column width="1/4">
              <LabelledContent label="Gas">
                <Text size="12px">{transaction.gas.toString()}</Text>
              </LabelledContent>
            </Column>
            {receipt?.gasUsed ? (
              <Column>
                <LabelledContent label="Gas Used/Limit">
                  <Text size="12px">
                    {numberIntl.format(Number(receipt.gasUsed?.toString()))} /{' '}
                    {numberIntl.format(Number(transaction.gas?.toString()))} (
                    {Math.round(
                      (Number(receipt.gasUsed) / Number(transaction.gas)) * 100,
                    )}
                    %)
                  </Text>
                </LabelledContent>
              </Column>
            ) : null}
            {receipt?.effectiveGasPrice && receipt?.gasUsed ? (
              <Column width="1/3">
                <LabelledContent label="Fee">
                  <Text size="12px">
                    {numberIntl4SigFigs.format(
                      Number(
                        formatEther(
                          receipt?.effectiveGasPrice * receipt?.gasUsed,
                        ),
                      ),
                    )}{' '}
                    <Text color="text/tertiary">ETH</Text>
                  </Text>
                </LabelledContent>
              </Column>
            ) : null}
          </Columns>
          <Tabs.Root asChild defaultValue={params.get('tab') ?? 'data'}>
            <Box display="flex" flexDirection="column" height="full">
              <TabsList
                items={[
                  { label: 'Data', value: 'data' },
                  { label: 'Logs', value: 'logs' },
                  calls && { label: 'Calls', value: 'calls' },
                ].filter(Boolean)}
              />
              <Inset vertical="16px" bottom="152px">
                <TabsContent inset={false} scrollable={false} value="data">
                  <DecodedCalldata
                    address={transaction.to || undefined}
                    data={transaction.input}
                  />
                </TabsContent>
                <TabsContent inset={false} scrollable={false} value="logs">
                  {isReceiptLoading && (
                    <Text color="text/tertiary">Loading...</Text>
                  )}
                  {!isReceiptLoading && (
                    <>
                      {receipt?.logs && receipt.logs.length > 0 ? (
                        <Bleed horizontal="-8px" top="-16px">
                          <DecodedLogs
                            logs={
                              receipt.logs as Log<
                                bigint,
                                number,
                                false,
                                AbiEvent
                              >[]
                            }
                          />
                        </Bleed>
                      ) : (
                        <Text color="text/secondary" size="14px">
                          No logs found.
                        </Text>
                      )}
                    </>
                  )}
                </TabsContent>
                <TabsContent inset={false} scrollable={false} value="calls">
                  <Bleed horizontal="-8px" top="-16px">
                    <Inset space="8px">
                      <Columns alignVertical="center" gap="8px">
                        <Column width="content">
                          <Box style={{ width: '100px' }}>
                            <Text color="text/tertiary" size="9px" wrap={false}>
                              TYPE
                            </Text>
                          </Box>
                        </Column>
                        <Column>
                          <Box style={{ width: '120px' }}>
                            <Text color="text/tertiary" size="9px" wrap={false}>
                              TO
                            </Text>
                          </Box>
                        </Column>
                        <Column alignHorizontal="right" alignVertical="center">
                          <Text color="text/tertiary" size="9px" wrap={false}>
                            VALUE
                          </Text>
                        </Column>
                      </Columns>
                    </Inset>
                    <Separator />
                    {calls?.map((call) => {
                      const isSelf = call?.hash === receipt?.transactionHash
                      const isTransfer = !call?.data

                      return (
                        <Fragment key={call.hash}>
                          <Link
                            to={`/transaction/${call.hash}?tab=calls`}
                            replace
                          >
                            <Box
                              as="button"
                              alignItems="center"
                              backgroundColor={(() => {
                                if (isSelf) return 'surface/fill/quarternary'
                                return { hover: 'surface/fill/quarternary' }
                              })()}
                              display="flex"
                              width="full"
                              style={{ height: '32px' }}
                            >
                              <Inset space="8px">
                                <Columns alignVertical="center" gap="8px">
                                  <Column
                                    alignVertical="center"
                                    width="content"
                                  >
                                    <Box style={{ width: '100px' }}>
                                      {!isTransfer ? (
                                        <FormattedAbiFunctionName
                                          data={call.data!}
                                        />
                                      ) : (
                                        <Text color="text/tertiary" size="11px">
                                          Transfer
                                        </Text>
                                      )}
                                    </Box>
                                  </Column>
                                  <Column
                                    alignVertical="center"
                                    width="content"
                                  >
                                    <Box style={{ width: '120px' }}>
                                      {call?.to && (
                                        <Text.Truncated size="11px">
                                          {call.to}
                                        </Text.Truncated>
                                      )}
                                    </Box>
                                  </Column>
                                  <Column
                                    alignHorizontal="right"
                                    alignVertical="center"
                                  >
                                    {call?.value && (
                                      <Text size="11px">
                                        {`${numberIntl.format(
                                          Number(
                                            formatEther(
                                              hexToBigInt(call.value),
                                            ),
                                          ),
                                        )} ETH`}
                                      </Text>
                                    )}
                                  </Column>
                                </Columns>
                              </Inset>
                            </Box>
                          </Link>
                          <Separator />
                        </Fragment>
                      )
                    })}
                  </Bleed>
                </TabsContent>
              </Inset>
            </Box>
          </Tabs.Root>
        </Stack>
      </Container>
    </>
  )
}
