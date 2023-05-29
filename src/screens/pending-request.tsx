import { formatEther, hexToBigInt } from 'viem'

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
