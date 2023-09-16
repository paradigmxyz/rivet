import { Fragment } from 'react'
import { connect, disconnect } from '~/actions'
import { Container, LabelledContent } from '~/components'
import {
  Box,
  Button,
  Inline,
  Input,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useHost } from '~/hooks/useHost'
import { getMessenger } from '~/messengers'
import { useSessionsStore } from '~/zustand'

const inpageMessenger = getMessenger('wallet:inpage')

export default function Session() {
  const { data: host } = useHost()
  const { getSession, sessions, instantMode, updateInstantMode } =
    useSessionsStore()
  const isConnected = Boolean(host && getSession({ host }))

  return (
    <>
      <Box>
        <Container dismissable fit header={host?.replace('www.', '')}>
          {isConnected ? (
            <Button
              onClick={() =>
                host && disconnect({ host, messenger: inpageMessenger })
              }
              variant="solid fill"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="solid fill"
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
        <Container fit header={'Authorization'}>
          <Inline alignVertical="center" alignHorizontal="justify" wrap={false}>
            <Text size="12px">{'Enable Instant Authorization mode'}</Text>
            <Input
              type="checkbox"
              style={{
                height: '16px',
                float: 'right',
                width: 'auto',
                marginRight: '10px',
              }}
              checked={instantMode}
              onChange={(e) => {
                updateInstantMode({ mode: e.target.checked })
              }}
            />
          </Inline>
        </Container>
      </Box>
      <Box>
        <Container fit header="Sessions">
          <Stack gap="16px">
            {Object.values(sessions).map((session) => {
              return (
                <Fragment key={session.host}>
                  <Inline
                    alignVertical="center"
                    alignHorizontal="justify"
                    wrap={false}
                  >
                    <LabelledContent label="Host" width="fit">
                      <Text size="12px">{session.host}</Text>
                    </LabelledContent>
                    <Button.Symbol
                      height="24px"
                      symbol="trash"
                      onClick={() => {
                        disconnect({
                          host: session.host,
                          messenger: inpageMessenger,
                        })
                      }}
                      variant="ghost red"
                    />
                  </Inline>
                  <Separator />
                </Fragment>
              )
            })}
          </Stack>
        </Container>
      </Box>
    </>
  )
}
