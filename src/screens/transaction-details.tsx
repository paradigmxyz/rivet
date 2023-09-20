import * as Tabs from '@radix-ui/react-tabs'
import type { AbiEvent } from 'abitype'
import { useParams } from 'react-router-dom'
import { type Hash, type Log, formatEther, formatGwei } from 'viem'

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
import { capitalize, truncate } from '~/utils'

const numberIntl = new Intl.NumberFormat()
const numberIntl4SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 4,
})

export default function TransactionDetails() {
  const { transactionHash } = useParams()

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

  if (!transaction) return null
  return (
    <>
      <Container
        dismissable
        header={`Transaction ${truncate(transaction.hash, { start: 8 })}`}
      >
        <Stack gap="20px">
          <Columns gap="12px">
            <Column width="1/3">
              <LabelledContent label="Hash">
                <Tooltip label={<Text size="9px">{transaction.hash}</Text>}>
                  <Text size="12px">
                    {truncate(transaction.hash!.toString(), { start: 8 })}
                  </Text>
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
                  <Text size="12px">
                    {truncate(transaction.from, { start: 4 })}
                  </Text>
                </Tooltip>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="To">
                <Tooltip label={transaction.to}>
                  <Text size="12px">
                    {transaction.to
                      ? truncate(transaction.to, { start: 4 })
                      : null}
                  </Text>
                </Tooltip>
              </LabelledContent>
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
          <Tabs.Root asChild defaultValue="data">
            <Box display="flex" flexDirection="column" height="full">
              <TabsList
                items={[
                  { label: 'Data', value: 'data' },
                  { label: 'Logs', value: 'logs' },
                  { label: 'Trace', value: 'trace' },
                ]}
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
                <TabsContent inset={false} value="state">
                  {''}
                </TabsContent>
              </Inset>
            </Box>
          </Tabs.Root>
        </Stack>
      </Container>
    </>
  )
}
