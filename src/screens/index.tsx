import { Box, Text } from '~/design-system'
import { useNetwork } from '~/zustand'

export default function Index() {
  const { network } = useNetwork()
  return (
    <Box padding='12px'>
      <Text>Block number: {network.blockNumber?.toString()}</Text>
    </Box>
  )
}
