import { Fragment } from 'react'
import { connect, disconnect } from '~/actions'
import { Container, LabelledContent } from '~/components'
import {
  Box,
  Button,
  Inline,
  Inset,
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
  const { getSession, sessions, instantAuth, setInstantAuth } =
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
          <Inset right="4px">
            <Box>
              <Inline
                alignVertical="center"
                alignHorizontal="justify"
                wrap={false}
              >
                <Box as="label" htmlFor="instant-auth" width="full">
                  <Text size="12px">Enable Instant Authorization</Text>
                </Box>
                {/** TODO: <Checkbox> component */}
                <Box
                  as="input"
                  id="instant-auth"
                  checked={instantAuth}
                  onChange={(e) => {
                    setInstantAuth(e.target.checked)
                  }}
                  type="checkbox"
                />
              </Inline>
            </Box>
          </Inset>
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
                      <Text size="12px">
                        {session.host.replace('www.', '')}
                      </Text>
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
