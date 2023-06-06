import { Box, Text } from '~/design-system'
import { useBlockNumber } from '~/hooks'

export default function Index() {
  const { data: blockNumber } = useBlockNumber()
  return (
    <Box padding='12px'>
      <Text>Block number: {blockNumber?.toString()}</Text>
    </Box>
  )
}
