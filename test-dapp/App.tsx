import { useEffect, useState } from 'react'
import {
  type Address,
  type Hash,
  type Hex,
  isHex,
  numberToHex,
  parseEther,
  stringToHex,
  stringify,
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
      paddingBottom='152px'
    >
      <Stack gap='32px'>
        <Text weight='semibold' size='32px'>
          Test Dapp
        </Text>
        <RequestAccounts />
        <Accounts />
        <BlockNumber />
        <ChainId />
        <SendTransaction />
        <SignMessage />
        <SignTypedData />
      </Stack>
    </Box>
  )
}

function RequestAccounts() {
  const [accounts, setAccounts] = useState<Address[]>()

  useEffect(() => {
    ;(async () => {
      const accounts = await window.ethereum?.request({
        method: 'eth_requestAccounts',
      })
      setAccounts(accounts)
    })()
  }, [])

  return (
    <Stack gap='12px'>
      <Text size='18px' weight='semibold'>
        eth_requestAccounts
      </Text>
      {accounts?.map((account) => (
        <Text>{account}</Text>
      ))}
    </Stack>
  )
}

function Accounts() {
  const [accounts, setAccounts] = useState<Address[]>()

  useEffect(() => {
    ;(async () => {
      const accounts = await window.ethereum?.request({
        method: 'eth_accounts',
      })
      setAccounts(accounts)
    })()
  }, [])

  return (
    <Stack gap='12px'>
      <Text size='18px' weight='semibold'>
        eth_accounts
      </Text>
      {accounts?.map((account) => (
        <Text>{account}</Text>
      ))}
    </Stack>
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

function ChainId() {
  const [chainId, setChainId] = useState<Hex>()

  useEffect(() => {
    ;(async () => {
      setChainId(await window.ethereum?.request({ method: 'eth_chainId' }))
    })()
  }, [])

  return (
    <Stack gap='12px'>
      <Text size='18px' weight='semibold'>
        eth_chainId
      </Text>
      <Text>{chainId}</Text>
    </Stack>
  )
}

function SendTransaction() {
  const [to, setTo] = useState<Address>()
  const [value, setValue] = useState<`${number}`>()

  const [hash, setHash] = useState<Hash | undefined>()
  const [error, setError] = useState<Error>()

  const handleClickSend = async () => {
    if (!to) return
    if (!value) return

    setHash(undefined)
    try {
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
    } catch (err) {
      setError(err as Error)
    }
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
      {error && <Text>Error: {error.message}</Text>}
    </Stack>
  )
}

function SignMessage() {
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState<Hex | undefined>()
  const [error, setError] = useState<Error>()

  const handleClickSign = async () => {
    if (!message) return

    setSignature(undefined)
    try {
      const signature = await window.ethereum?.request({
        method: 'personal_sign',
        params: [
          stringToHex(message),
          '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        ],
      })
      setSignature(signature)
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <Stack gap='12px'>
      <Text size='18px' weight='semibold'>
        eth_signMessage
      </Text>
      <Inline wrap={false} gap='12px'>
        <Box style={{ width: '500px' }}>
          <Input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder='message'
          />
        </Box>
        <Button onClick={handleClickSign} width='fit'>
          Sign
        </Button>
      </Inline>
      {signature && <Text>Signature: {signature}</Text>}
      {error && <Text>Error: {error.message}</Text>}
    </Stack>
  )
}

function SignTypedData() {
  const [signature, setSignature] = useState<Hex | undefined>()
  const [error, setError] = useState<Error>()

  const handleClickSign = async () => {
    setSignature(undefined)
    try {
      const typedData = stringify(
        {
          domain: {
            name: 'Ether Mail',
            version: '1',
            chainId: 1,
            verifyingContract: '0x0000000000000000000000000000000000000000',
          },
          types: {
            Person: [
              { name: 'name', type: 'string' },
              { name: 'wallet', type: 'address' },
            ],
            Mail: [
              { name: 'from', type: 'Person' },
              { name: 'to', type: 'Person' },
              { name: 'contents', type: 'string' },
            ],
          },
          primaryType: 'Mail',
          message: {
            from: {
              name: 'Cow',
              wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            },
            to: {
              name: 'Bob',
              wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            },
            contents: 'Hello, Bob!',
          },
        },
        (_, value) => (isHex(value) ? value.toLowerCase() : value),
      )
      const signature = await window.ethereum?.request({
        method: 'eth_signTypedData_v4',
        params: ['0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', typedData],
      })
      setSignature(signature)
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <Stack gap='12px'>
      <Text size='18px' weight='semibold'>
        eth_signTypedData_v4
      </Text>
      <Inline wrap={false} gap='12px'>
        <Button onClick={handleClickSign} width='fit'>
          Sign
        </Button>
      </Inline>
      {signature && <Text>Signature: {signature}</Text>}
      {error && <Text>Error: {error.message}</Text>}
    </Stack>
  )
}
