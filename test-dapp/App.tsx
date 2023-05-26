import { useEffect, useState } from 'react'
import {
  type Address,
  type Hash,
  type Hex,
  numberToHex,
  parseEther,
} from 'viem'
import 'viem/window'
import '~/design-system/styles/global.css'

import { Box, Button, Inline, Input, Stack, Text } from '~/design-system'

export default function App() {
  return (
    <Box
      backgroundColor='body'
      marginHorizontal='auto'
      maxWidth='1152px'
      paddingTop='40px'
    >
      <Stack gap='32px'>
        <Text weight='semibold' size='32px'>
          Test Dapp
        </Text>
        <BlockNumber />
        <SendTransaction />
      </Stack>
    </Box>
  )
}

function BlockNumber() {
  const [blockNumber, setBlockNumber] = useState<Hex>()

  useEffect(() => {
    ;(async () => {
      setBlockNumber(
        await window.ethereum?.request({ method: 'eth_blockNumber' }),
      )
    })()
  }, [])

  return (
    <Stack gap='12px'>
      <Text size='18px' weight='semibold'>
        eth_blockNumber
      </Text>
      <Text>{blockNumber}</Text>
    </Stack>
  )
}

function SendTransaction() {
  const [to, setTo] = useState<Address>()
  const [value, setValue] = useState<`${number}`>()

  const [hash, setHash] = useState<Hash | undefined>()

  const handleClickSend = async () => {
    if (!to) return
    if (!value) return

    setHash(undefined)
    const hash = await window.ethereum?.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          to,
          value: numberToHex(parseEther(value)),
        },
      ],
    })
    setHash(hash)
  }

  return (
    <Stack gap='12px'>
      <Text size='18px' weight='semibold'>
        eth_sendTransaction
      </Text>
      <Inline wrap={false} gap='12px'>
        <Box style={{ width: '500px' }}>
          <Input
            onChange={(e) => setTo(e.target.value as Address)}
            value={to}
            placeholder='to'
          />
        </Box>
        <Box>
          <Input
            onChange={(e) => setValue(e.target.value as `${number}`)}
            value={value}
            placeholder='value'
          />
        </Box>
        <Button onClick={handleClickSend} width='fit'>
          Send
        </Button>
      </Inline>
      {hash && <Text>Tx Hash: {hash}</Text>}
    </Stack>
  )
}
