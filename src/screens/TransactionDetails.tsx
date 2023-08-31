import { useParams } from 'react-router-dom'
import { type Hash, formatEther, formatGwei } from 'viem'
import { Container, LabelledContent, Tooltip } from '~/components'
import { Column, Columns, Separator, Stack, Text } from '~/design-system'
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
  const { data: receipt } = useTransactionReceipt({
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
                {receipt?.status === undefined ? (
                  <Text color="text/tertiary" size="12px">
                    Pending
                  </Text>
                ) : (
                  <Text size="12px">{capitalize(receipt?.status)}</Text>
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
                  ETH
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
                      : null}
                    /
                    {transaction.maxFeePerGas
                      ? `${numberIntl.format(
                          Number(formatGwei(transaction.maxFeePerGas)),
                        )}`
                      : null}{' '}
                    gwei
                  </Text>
                </LabelledContent>
              ) : (
                <LabelledContent label="Gas Price">
                  <Text size="12px">
                    {transaction.gasPrice
                      ? `${numberIntl.format(
                          Number(formatGwei(transaction.gasPrice)),
                        )} gwei`
                      : null}
                  </Text>
                </LabelledContent>
              )}
            </Column>
            {receipt && transaction.type === 'eip1559' && (
              <Column width="1/3">
                <LabelledContent label="Actual Fee Per Gas">
                  <Text size="12px">
                    {receipt.effectiveGasPrice
                      ? `${numberIntl.format(
                          Number(formatGwei(receipt.effectiveGasPrice)),
                        )} gwei`
                      : null}
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
                    ETH
                  </Text>
                </LabelledContent>
              </Column>
            ) : null}
          </Columns>
          <Separator />
          <Columns gap="12px">
            <Column width="1/3">
              <LabelledContent label="r">
                <Tooltip label={<Text size="9px">{transaction.r}</Text>}>
                  <Text size="12px">
                    {truncate(transaction.r, { start: 4 })}
                  </Text>
                </Tooltip>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="s">
                <Tooltip label={<Text size="9px">{transaction.s}</Text>}>
                  <Text size="12px">
                    {truncate(transaction.s, { start: 4 })}
                  </Text>
                </Tooltip>
              </LabelledContent>
            </Column>
            <Column width="1/3">
              <LabelledContent label="v">
                <Text size="12px">{transaction.v.toString()}</Text>
              </LabelledContent>
            </Column>
          </Columns>
          <Separator />
          <Columns gap="12px">
            <Column>
              <LabelledContent label="Calldata">
                <Text size="12px">{transaction.input}</Text>
              </LabelledContent>
            </Column>
          </Columns>
        </Stack>
      </Container>
    </>
  )
}
