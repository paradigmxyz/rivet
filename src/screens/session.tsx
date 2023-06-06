import { Link } from 'react-router-dom'

import { connect, disconnect } from '~/actions'
import { Container } from '~/components'
import { Box, Button, Inline, SFSymbol, Text } from '~/design-system'
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
        <Container
          fit
          header={
            <Inline
              alignVertical='center'
              alignHorizontal='justify'
              wrap={false}
            >
              <Text size='16px'>{host?.replace('www.', '')}</Text>
              <Link to='/'>
                <SFSymbol
                  color='label'
                  size='12px'
                  symbol='xmark'
                  weight='medium'
                />
              </Link>
            </Inline>
          }
        >
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
        <Container fit header={<Text size='16px'>Sessions</Text>}>
          TODO
        </Container>
      </Box>
    </>
  )
}
