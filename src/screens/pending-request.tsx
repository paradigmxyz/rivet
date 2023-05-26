import { formatEther, hexToBigInt } from 'viem'

import { Button, Inline, Row, Rows, Stack, Text } from '~/design-system'
import { createPendingRequestMessenger } from '~/messengers'

import type { RpcRequest } from '../messengers/createRpcMessenger'

const pendingRequestMessenger = createPendingRequestMessenger({
  connection: 'background <> devtools',
})

export default function PendingRequest({ request }: { request: RpcRequest }) {
  const handleApprove = async () => {
    await pendingRequestMessenger.send('pendingRequest', {
      request,
      type: 'approve',
    })
  }

  return (
    <Rows>
      <Row>
        <Stack gap='32px'>
          <Text weight='medium' size='22px'>
            Pending Request
          </Text>
          <Stack gap='12px'>
            <Text size='12px'>From: {request.params[0].from}</Text>
            <Text size='12px'>To: {request.params[0].to}</Text>
            <Text size='12px'>
              Value: {formatEther(hexToBigInt(request.params[0].value))}
            </Text>
          </Stack>
        </Stack>
      </Row>
      <Row height='content'>
        <Inline gap='12px' wrap={false}>
          <Button onClick={handleApprove} variant='tint green'>
            Approve
          </Button>
          <Button variant='tint red'>Reject</Button>
        </Inline>
      </Row>
    </Rows>
  )
}
