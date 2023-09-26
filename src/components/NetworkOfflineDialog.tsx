import * as Dialog from '@radix-ui/react-dialog'
import { Box, Inset, Stack, Text } from '~/design-system'
import * as styles from './NetworkOfflineDialog.css'

export function NetworkOfflineDialog() {
  return (
    <Dialog.Root open modal={false}>
      <Dialog.Overlay asChild>
        <Box
          alignItems="center"
          backgroundColor="surface/black@0.5"
          display="flex"
          justifyContent="center"
          position="absolute"
          height="full"
          width="full"
          zIndex="dialogOverlay"
        />
      </Dialog.Overlay>
      <Dialog.Content asChild>
        <Box
          alignItems="center"
          backgroundColor="surface/black@0.5"
          className={styles.content}
          display="flex"
          justifyContent="center"
          position="absolute"
          height="full"
          width="full"
          zIndex="dialogContent"
        >
          <Box
            alignItems="center"
            backgroundColor="surface/primary/elevated"
            borderLeftWidth="1px"
            borderRightWidth="1px"
            borderTopWidth="1px"
            borderBottomWidth="1px"
            display="flex"
            marginTop="-80px"
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
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  )
}
