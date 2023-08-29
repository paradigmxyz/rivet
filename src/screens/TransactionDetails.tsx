import { useParams } from 'react-router-dom'
import { type Hash, formatEther, formatGwei } from 'viem'
import { Container, LabelledContent } from '~/components'
import { Column, Columns, Separator, Stack, Text } from '~/design-system'
import { useTransaction } from '~/hooks/useTransaction'
import { useTransactionConfirmations } from '~/hooks/useTransactionConfirmations'
import { useTransactionReceipt } from '~/hooks/useTransactionReceipt'
import { truncate } from '~/utils'

const numberIntl = new Intl.NumberFormat()
const numberIntl4SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 4,
})

export default function TransactionDetails() {
  const { transactionHash } = useParams()

  const { data: transaction } = useTransaction({
    hash: transactionHash as Hash,
  })

  const { data: receipt } = useTransactionReceipt({
    hash: transaction?.hash as Hash,
  })

  const { data: confirmations } = useTransactionConfirmations({
    hash: receipt?.transactionHash as Hash,
  })

  if (!transaction) return null

  return (
    <>
      <Container
        dismissable
        header={`Transaction ${truncate(transaction.hash, { start: 4 })}`}
      >
        <Stack gap="20px">
          <Columns gap="12px">
            <Column width="1/3">
              <LabelledContent label="Hash">
                <Text size="12px">
                  {truncate(transaction.hash!.toString(), { start: 8 })}
                </Text>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="Status">
                {receipt?.status === undefined ? (
                  <Text color="text/tertiary" size="12px">
                    Pending
                  </Text>
                ) : (
                  <Text size="12px">{receipt?.status}</Text>
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
                <Text size="12px">
                  {truncate(transaction.from, { start: 4 })}
                </Text>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="To">
                <Text size="12px">
                  {truncate(
                    transaction.to
                      ? transaction.to
                      : '0x0000000000000000000000000000000000000000',
                    { start: 4 },
                  )}
                </Text>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="Value">
                <Text size="12px">
                  {numberIntl4SigFigs.format(
                    Number(formatEther(transaction.value!)),
                  )}{' '}
                  ETH
                </Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Separator />
          <Columns gap="12px">
            <Column width="1/3">
              <LabelledContent label="Gas">
                <Text size="12px">{transaction.gas.toString()}</Text>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="Base Fee">
                <Text size="12px">
                  {numberIntl.format(Number(formatGwei(transaction.gasPrice!)))}{' '}
                  gwei
                </Text>
              </LabelledContent>
            </Column>
            {receipt?.gasUsed ? (
              <Column width="1/3">
                <LabelledContent label="Gas Used">
                  <Text size="12px">{receipt?.gasUsed.toString()}</Text>
                </LabelledContent>
              </Column>
            ) : null}
          </Columns>
          {receipt && (
            <>
              <Columns gap="12px">
                <Column width="1/3">
                  <LabelledContent label="type">
                    <Text size="12px">{receipt.type}</Text>
                  </LabelledContent>
                </Column>
                <Column>
                  <LabelledContent label="cumulative gas used">
                    <Text size="12px">
                      {receipt.cumulativeGasUsed.toString()}
                    </Text>
                  </LabelledContent>
                </Column>
                <Column>
                  <LabelledContent label="effective gas price">
                    <Text size="12px">
                      {receipt.effectiveGasPrice.toString()}
                    </Text>
                  </LabelledContent>
                </Column>
              </Columns>
              <Separator />
              <Columns gap="12px">
                <Column width="1/3">
                  <LabelledContent label="Block">
                    <Text size="12px">{receipt.blockNumber.toString()}</Text>
                  </LabelledContent>
                </Column>
                <Column width="1/3">
                  <LabelledContent label="Block Hash">
                    <Text size="12px">
                      {truncate(receipt.blockHash, { start: 4 })}
                    </Text>
                  </LabelledContent>
                </Column>
                <Column width="1/3">
                  <LabelledContent label="Index">
                    <Text size="12px">{receipt.transactionIndex}</Text>
                  </LabelledContent>
                </Column>
              </Columns>
            </>
          )}
          <Separator />
          <Columns gap="12px">
            <Column width="1/3">
              <LabelledContent label="v">
                <Text size="12px">{transaction.v.toString()}</Text>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="r">
                <Text size="12px">{truncate(transaction.r, { start: 4 })}</Text>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="s">
                <Text size="12px">{truncate(transaction.s, { start: 4 })}</Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Columns gap="12px">
            <Column width="1/3">
              <LabelledContent label="Confirmations">
                <Text size="12px">{confirmations?.toString()}</Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Columns gap="12px">
            <Column>
              <LabelledContent label="input data">
                <Text
                  style={{ wordBreak: 'break-all' }}
                  wrap={false}
                  width="full"
                  size="12px"
                >
                  {transaction.input}
                </Text>
              </LabelledContent>
            </Column>
          </Columns>
        </Stack>
      </Container>
    </>
  )
}
