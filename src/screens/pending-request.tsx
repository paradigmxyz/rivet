import {
  type EIP1474Methods,
  formatEther,
  hexToBigInt,
  hexToString,
} from 'viem'

import { Container } from '~/components'
import { Button, Inline, Stack, Text } from '~/design-system'
import { usePendingBlockQueryOptions } from '~/hooks/usePendingBlock'
import { usePendingTransactionsQueryOptions } from '~/hooks/usePendingTransactions'
import { useTxpoolQueryOptions } from '~/hooks/useTxpool'
import { getMessenger } from '~/messengers'
import type { RpcRequest } from '~/messengers/schema'
import { queryClient } from '~/react-query'

const backgroundMessenger = getMessenger({
  connection: 'background <> wallet',
})

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
  const [{ from, to, value }] = params
  return (
    <Stack gap="12px">
      <Text size="12px">From: {from}</Text>
      <Text size="12px">To: {to}</Text>
      <Text size="12px">Value: {formatEther(hexToBigInt(value ?? '0x0'))}</Text>
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
      <Text size="12px">Message: {hexToString(data)}</Text>
      <Text size="12px">Address: {address}</Text>
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
      <Text size="12px">Message:</Text>
      <Text as="pre" size="12px">
        {JSON.stringify(JSON.parse(data), null, 2)}
      </Text>
      <Text size="12px">Address: {address}</Text>
    </Stack>
  )
}
