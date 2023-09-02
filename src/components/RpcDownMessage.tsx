import { Box, Inset, Stack, Text } from '~/design-system';
import './RpcDownMessage.css';

export function RpcDown(){
  return (
    <div className="rpcdown-overlay">
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
            <Text size="12px">Once Anvil is reconnected, DevTools will automatically reconnect.</Text>
          </Stack>
        </Inset>
      </Box>
    </div>
  )
}
