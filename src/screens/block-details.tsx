import { Fragment } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import { type Transaction, formatEther, formatGwei } from 'viem'
import { Container, LabelledContent, Tooltip } from '~/components'
import {
  Box,
  Column,
  Columns,
  Inline,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useBlock } from '~/hooks/useBlock'
import { truncate } from '~/utils'

const numberIntl = new Intl.NumberFormat()
const numberIntl4SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 4,
})
const numberIntl6SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 6,
})

export default function BlockDetails() {
  const { blockNumber } = useParams()
  const [params] = useSearchParams()

  const status = params.get('status')
  const isPending = status === 'pending'

  const { data: block } = useBlock({
    ...(isPending
      ? { blockTag: 'pending' }
      : { blockNumber: BigInt(blockNumber!) }),
    includeTransactions: true,
  })

  if (!block) return null
  return (
    <>
      <Container dismissable fit header={`Block ${blockNumber}`}>
        <Stack gap="20px">
          <Columns gap="8px">
            <Column width="1/4">
              <LabelledContent label="Block">
                <Text size="12px">{blockNumber}</Text>
              </LabelledContent>
            </Column>
            <LabelledContent label="Timestamp">
              {isPending ? (
                <Text color="text/tertiary" size="12px">
                  Pending
                </Text>
              ) : (
                <Text size="12px">
                  {new Date(Number(block.timestamp! * 1000n)).toLocaleString()}
                </Text>
              )}
            </LabelledContent>
            <Column width="1/4">
              <LabelledContent label="Transactions">
                <Text size="12px">{block.transactions.length || '0'}</Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Columns gap="8px">
            {block.hash && (
              <Column width="1/4">
                <LabelledContent label="Hash">
                  <Tooltip label={block.hash}>
                    <Text size="12px">
                      {truncate(block.hash, { start: 4 })}
                    </Text>
                  </Tooltip>
                </LabelledContent>
              </Column>
            )}
            <Column width="1/4">
              <LabelledContent label="Base Fee">
                <Text size="12px">
                  {numberIntl6SigFigs.format(
                    Number(formatGwei(block.baseFeePerGas!)),
                  )}{' '}
                  gwei
                </Text>
              </LabelledContent>
            </Column>
            <Column>
              <LabelledContent label="Gas Used/Limit">
                <Text size="12px" wrap={false}>
                  {numberIntl.format(Number(block.gasUsed?.toString()))} /{' '}
                  {numberIntl.format(Number(block.gasLimit?.toString()))} (
                  {Math.round(
                    (Number(block.gasUsed) / Number(block.gasLimit)) * 100,
                  )}
                  %)
                </Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Columns gap="8px">
            <Column width="1/4">
              <LabelledContent label="Fee Recipient">
                <Tooltip label={block.miner}>
                  <Text size="12px">{truncate(block.miner, { start: 4 })}</Text>
                </Tooltip>
              </LabelledContent>
            </Column>
            <Column width="3/4">
              <LabelledContent label="Total Difficulty">
                <Text size="12px">
                  {numberIntl.format(Number(block.totalDifficulty?.toString()))}
                </Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Columns gap="8px">
            <Column width="1/4">
              <LabelledContent label="Size">
                <Text size="12px">
                  {numberIntl.format(Number(block.size.toString()))} bytes
                </Text>
              </LabelledContent>
            </Column>
            <LabelledContent label="Logs Bloom">
              <Tooltip label={block.logsBloom!}>
                <Text size="12px">{truncate(block.logsBloom!)}</Text>
              </Tooltip>
            </LabelledContent>
          </Columns>
          {block.transactions.length > 0 && (
            <>
              <Separator />
              <Stack gap="8px">
                <Text color="text/tertiary">Transactions</Text>
                <Box marginHorizontal="-12px">
                  {(block.transactions as Transaction[]).map(
                    (transaction, i) => (
                      <Fragment key={transaction.hash}>
                        {i !== 0 && <Separator />}
                        <Link to={`/transaction/${transaction.hash}`}>
                          <Box
                            backgroundColor={{
                              hover: 'surface/fill/quarternary',
                            }}
                            paddingHorizontal="12px"
                            paddingVertical="8px"
                          >
                            <Columns alignVertical="center">
                              <LabelledContent label="Hash">
                                <Inline
                                  alignVertical="center"
                                  gap="4px"
                                  wrap={false}
                                >
                                  <Tooltip label={transaction.hash}>
                                    <Text size="12px">
                                      {truncate(transaction.hash, { start: 4 })}
                                    </Text>
                                  </Tooltip>
                                </Inline>
                              </LabelledContent>
                              <LabelledContent label="From">
                                <Tooltip label={transaction.from}>
                                  <Text wrap={false} size="12px">
                                    {truncate(transaction.from, {
                                      start: 6,
                                      end: 4,
                                    })}
                                  </Text>
                                </Tooltip>
                              </LabelledContent>
                              <LabelledContent label="To">
                                <Tooltip label={transaction.to}>
                                  <Text wrap={false} size="12px">
                                    {transaction.to &&
                                      truncate(transaction.to, {
                                        start: 6,
                                        end: 4,
                                      })}
                                  </Text>
                                </Tooltip>
                              </LabelledContent>
                              <LabelledContent label="Value">
                                <Text wrap={false} size="12px">
                                  {numberIntl4SigFigs.format(
                                    Number(formatEther(transaction.value!)),
                                  )}{' '}
                                  ETH
                                </Text>
                              </LabelledContent>
                            </Columns>
                          </Box>
                        </Link>
                      </Fragment>
                    ),
                  )}
                </Box>
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </>
  )
}
