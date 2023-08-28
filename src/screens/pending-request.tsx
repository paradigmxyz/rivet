import {
  type EIP1474Methods,
  formatEther,
  hexToBigInt,
  hexToString,
} from 'viem'

import { Container, LabelledContent } from '~/components'
import { Button, Column, Columns, Inline, Stack, Text } from '~/design-system'
import { usePendingBlockQueryOptions } from '~/hooks/usePendingBlock'
import { usePendingTransactionsQueryOptions } from '~/hooks/usePendingTransactions'
import { useTxpoolQueryOptions } from '~/hooks/useTxpool'
import { getMessenger } from '~/messengers'
import type { RpcRequest } from '~/messengers/schema'
import { queryClient } from '~/react-query'
import { truncate } from '~/utils'

const backgroundMessenger = getMessenger('background:wallet')

export default function PendingRequest({ request }: { request: RpcRequest }) {
  const pendingBlockQueryOptions = usePendingBlockQueryOptions()
  const pendingTransactionsQueryOptions = usePendingTransactionsQueryOptions()
  const txpoolQueryOptions = useTxpoolQueryOptions()

  const handleApprove = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request,
      status: 'approved',
    })
    if (request.method === 'eth_sendTransaction') {
      queryClient.invalidateQueries(pendingBlockQueryOptions)
      queryClient.invalidateQueries(pendingTransactionsQueryOptions)
      queryClient.invalidateQueries(txpoolQueryOptions)
    }
  }

  const handleReject = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request,
      status: 'rejected',
    })
  }

  return (
    <Container
      header="Pending Request"
      footer={
        <Inline gap="12px" wrap={false}>
          <Button onClick={handleReject} variant="tint red">
            Reject
          </Button>
          <Button onClick={handleApprove} variant="tint green">
            Approve
          </Button>
        </Inline>
      }
    >
      <Stack gap="32px">
        {request.method === 'eth_sendTransaction' && (
          <SendTransactionDetails params={request.params} />
        )}
        {request.method === 'personal_sign' && (
          <SignMessageDetails params={request.params} />
        )}
        {request.method === 'eth_signTypedData_v4' && (
          <SignTypedData params={request.params} />
        )}
      </Stack>
    </Container>
  )
}

////////////////////////////////////////////////////////////////////////
// Detail Components

type ExtractParams<Method extends string> = Extract<
  EIP1474Methods[number],
  { Method: Method }
>['Parameters']

function SendTransactionDetails({
  params,
}: {
  params: ExtractParams<'eth_sendTransaction'>
}) {
  const [{ from, to, value, gas, data }] = params
  return (
    <Stack gap="12px">
      <Text size="14px">Send Transaction</Text>
      <Columns gap="12px">
        <Column width="1/4">
          <LabelledContent label="From">
            <Text wrap={false} size="12px">
              {truncate(from, {
                start: 6,
                end: 4,
              })}
            </Text>
          </LabelledContent>
        </Column>
        <Column width="1/4">
          <LabelledContent label="To">
            <Text wrap={false} size="12px">
              {to &&
                truncate(to, {
                  start: 6,
                  end: 4,
                })}
            </Text>
          </LabelledContent>
        </Column>
        <Column>
          <LabelledContent label="Value">
            <Text size="12px">
              {formatEther(hexToBigInt(value ?? '0x0'))} ETH
            </Text>
          </LabelledContent>
        </Column>
      </Columns>
      {gas && (
        <Columns gap="12px">
          <Column width="1/4">
            <LabelledContent label="Gas">
              <Text size="12px">{Number(hexToBigInt(gas ?? '0x0'))}</Text>
            </LabelledContent>
          </Column>
        </Columns>
      )}
      {data && (
        <Columns gap="12px">
          <Column>
            <LabelledContent label="Data">
              <Text size="12px" style={{ overflowWrap: 'break-word' }}>
                {data}
              </Text>
            </LabelledContent>
          </Column>
        </Columns>
      )}
    </Stack>
  )
}

function SignMessageDetails({
  params,
}: {
  params: ExtractParams<'personal_sign'>
}) {
  const [data, address] = params
  return (
    <Stack gap="12px">
      <Text size="14px">Sign Message</Text>
      <Columns gap="12px">
        <Column width="1/4">
          <LabelledContent label="Address">
            <Text wrap={false} size="12px">
              {truncate(address, {
                start: 6,
                end: 4,
              })}
            </Text>
          </LabelledContent>
        </Column>
      </Columns>
      <Columns gap="12px">
        <Column>
          <LabelledContent label="Message">
            <Text size="12px">{hexToString(data)}</Text>
          </LabelledContent>
        </Column>
      </Columns>
    </Stack>
  )
}

function SignTypedData({
  params,
}: {
  params: ExtractParams<'eth_signTypedData_v4'>
}) {
  const [address, data] = params
  return (
    <Stack gap="12px">
      <Text size="14px">Sign Data</Text>
      <Columns gap="12px">
        <Column width="1/4">
          <LabelledContent label="Address">
            <Text wrap={false} size="12px">
              {truncate(address, {
                start: 6,
                end: 4,
              })}
            </Text>
          </LabelledContent>
        </Column>
      </Columns>
      <Columns gap="12px">
        <Column>
          <LabelledContent label="Message">
            <Text as="pre" size="12px">
              {JSON.stringify(JSON.parse(data), null, 2)}
            </Text>
          </LabelledContent>
        </Column>
      </Columns>
    </Stack>
  )
}
