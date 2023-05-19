import { useEffect, useState } from 'react'
import type { Hex } from 'viem'
import 'viem/window'
import '~/design-system/styles/global.css'

import { Box, Stack, Text } from '~/design-system'

function App() {
  const [blockNumber, setBlockNumber] = useState<Hex>()
  useEffect(() => {
    ;(async () => {
      setBlockNumber(
        await window.ethereum?.request({ method: 'eth_blockNumber' }),
      )
    })()
  }, [])

  return (
    <Box
      backgroundColor='body'
      marginHorizontal='auto'
      maxWidth='1152px'
      paddingTop='40px'
    >
      <Stack gap='24px'>
        <Text weight='semibold' size='32px'>
          Test Dapp
        </Text>
        <Box>
          <Text>Block number: {blockNumber}</Text>
        </Box>
      </Stack>
    </Box>
  )
}

export default App
