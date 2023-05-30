import {
  type EIP1474Methods,
  formatEther,
  hexToBigInt,
  hexToString,
} from 'viem'

import { Button, Inline, Row, Rows, Stack, Text } from '~/design-system'
import { getMessenger } from '~/messengers'
import type { RpcRequest } from '~/messengers/schema'

const backgroundMessenger = getMessenger({
  connection: 'background <> wallet',
})

export default function PendingRequest({ request }: { request: RpcRequest }) {
  const handleApprove = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request,
      status: 'approved',
    })
  }

  const handleReject = async () => {
    await backgroundMessenger.send('pendingRequest', {
      request,
      status: 'rejected',
    })
  }

  return (
    <Rows>
      <Row>
        <Stack gap='32px'>
          <Text weight='medium' size='22px'>
            Pending Request
          </Text>
          {request.method === 'eth_sendTransaction' && (
            <SendTransactionDetails params={request.params} />
          )}
          {request.method === 'personal_sign' && (
            <SignMessageDetails params={request.params} />
          )}
        </Stack>
      </Row>
      <Row height='content'>
        <Inline gap='12px' wrap={false}>
          <Button onClick={handleApprove} variant='tint green'>
            Approve
          </Button>
          <Button onClick={handleReject} variant='tint red'>
            Reject
          </Button>
        </Inline>
      </Row>
    </Rows>
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
    <Stack gap='12px'>
      <Text size='12px'>From: {from}</Text>
      <Text size='12px'>To: {to}</Text>
      <Text size='12px'>Value: {formatEther(hexToBigInt(value ?? '0x0'))}</Text>
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
    <Stack gap='12px'>
      <Text size='12px'>Message: {hexToString(data)}</Text>
      <Text size='12px'>Address: {address}</Text>
    </Stack>
  )
}
