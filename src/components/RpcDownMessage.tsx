import * as Dialog from '@radix-ui/react-dialog'
import { Box, Inset, Stack, Text } from '~/design-system'
import './RpcDownMessage.css'

export function RpcDown() {
  return (
    <Dialog.Root open>
      <Dialog.Overlay className="rpcdown-overlay" />
      <Dialog.Content className="rpcdown-content">
        <Box
          alignItems="center"
          backgroundColor="surface/primary/elevated"
          borderLeftWidth="1px"
          borderRightWidth="1px"
          borderTopWidth="1px"
          borderBottomWidth="1px"
          display="flex"
          style={{
            height: '8vh',
            width: '80%',
          }}
        >
          <Inset horizontal="8px">
            <Stack gap="12px">
              <Text size="12px">Anvil is disconnected.</Text>
              <Text size="12px">
                Once Anvil is reconnected, DevTools will automatically
                reconnect.
              </Text>
            </Stack>
          </Inset>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  )
}
