import { connect, disconnect } from '~/actions'
import { Container } from '~/components'
import { Box, Button } from '~/design-system'
import { useHost } from '~/hooks/useHost'
import { getMessenger } from '~/messengers'
import { useSessionsStore } from '~/zustand'

const inpageMessenger = getMessenger({ connection: 'wallet <> inpage' })

export default function Session() {
  const { data: host } = useHost()
  const { sessions } = useSessionsStore()
  const isConnected = Boolean(host && sessions[host])

  return (
    <>
      <Box>
        <Container dismissable fit header={host?.replace('www.', '')}>
          {isConnected ? (
            <Button
              onClick={() =>
                host && disconnect({ host, messenger: inpageMessenger })
              }
              variant='solid fill'
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant='solid fill'
              onClick={() =>
                host && connect({ host, messenger: inpageMessenger })
              }
            >
              Connect
            </Button>
          )}
        </Container>
      </Box>
      <Box>
        <Container fit header='Sessions'>
          TODO
        </Container>
      </Box>
    </>
  )
}
