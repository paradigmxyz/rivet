import { connect, disconnect } from '~/actions'
import { Container } from '~/components'
import { Box, Button } from '~/design-system'
import { useHost } from '~/hooks'
import { getMessenger } from '~/messengers'
import { useSessions } from '~/zustand'

const inpageMessenger = getMessenger({ connection: 'wallet <> inpage' })

export default function Session() {
  const { data: host } = useHost()
  const { sessions } = useSessions()
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
              variant='tint primary'
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant='tint primary'
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
