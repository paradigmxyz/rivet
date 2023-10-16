import { createStore } from 'mipd'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import {
  type Address,
  type EIP1193Provider,
  type Hash,
  type Hex,
  createClient,
  custom,
  hexToNumber,
  isHex,
  numberToHex,
  parseEther,
  parseGwei,
  publicActions,
  stringToHex,
  stringify,
  walletActions,
} from 'viem'
import 'viem/window'

import '~/design-system/styles/global.css'

import {
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Input,
  Stack,
  Text,
} from '~/design-system'
import type { Client } from '~/viem'

import { MockERC20, MockERC721, Playground } from '../contracts/generated'

const store = createStore()

const Context = createContext({
  client: null as unknown as Client,
  provider: null as unknown as EIP1193Provider,
})

export default function App() {
  const hasReloaded = useReloadAfterFirstInstall()
  if (!hasReloaded) return null

  const providerDetails = useSyncExternalStore(
    store.subscribe,
    store.getProviders,
  )
  if (providerDetails.length === 0) return <InstallExtension />

  const [{ provider }] = providerDetails
  const client = useMemo(
    () =>
      createClient({
        transport: custom(provider),
        pollingInterval: 100,
      })
        .extend(publicActions)
        .extend(walletActions) as unknown as Client,
    [provider],
  )

  return (
    <Context.Provider value={{ client, provider }}>
      <Box
        backgroundColor="surface/primary"
        marginHorizontal="auto"
        paddingTop="40px"
        paddingBottom="152px"
        style={{ maxWidth: '1152px' }}
      >
        <Stack gap="32px">
          <Text weight="semibold" size="32px">
            Test Dapp
          </Text>
          <Text weight="semibold" size="22px">
            Events
          </Text>
          <AccountsChanged />
          <ChainChanged />
          <Connect />
          <Text weight="semibold" size="22px">
            Methods
          </Text>
          <RequestAccounts />
          <Accounts />
          <BlockNumber />
          <ChainId />
          <SendTransaction />
          <SignMessage />
          <SignTypedData />
          <Text weight="semibold" size="22px">
            Contract: Playground.sol
          </Text>
          <ContractPlayground />
          <Text weight="semibold" size="22px">
            Contract: MockERC20.sol
          </Text>
          <ContractMockERC20 />
          <Text weight="semibold" size="22px">
            Contract: MockERC721.sol
          </Text>
          <ContractMockERC721 />
        </Stack>
      </Box>
    </Context.Provider>
  )
}

function InstallExtension() {
  return (
    <Box
      backgroundColor="surface/primary"
      marginHorizontal="auto"
      paddingTop="40px"
      paddingBottom="152px"
      style={{ maxWidth: '1152px' }}
    >
      <Stack gap="28px">
        <Text weight="bold" size="32px">
          Install or Enable Extension
        </Text>
        <Stack gap="28px">
          <Text as="p" size="18px">
            Once you have your dev server running, you can install the Web
            Extension in your browser. To do so, follow these steps:
          </Text>
          <Text> 1. Open your browser's Extensions page </Text>
          <Text> 2. Enable "Developer mode" in the top right corner </Text>
          <Text> 3. Click "Load unpacked" in the top left corner </Text>
          <Text>
            {' '}
            4. Select the `dist/dev` folder in Rivet's root directory{' '}
          </Text>
          <Text>
            5. You're good to go! Refresh this page again to show test dapp.
            Don't forget to pin the Extension to your browser's toolbar for easy
            access.
          </Text>
        </Stack>
      </Stack>
    </Box>
  )
}

function AccountsChanged() {
  const { provider } = useContext(Context)

  const [accounts, setAccounts] = useState<Address[][]>([])
  useEffect(() => {
    provider.on('accountsChanged', (accounts) => {
      setAccounts((x) => [...x, accounts as Address[]])
    })
  }, [provider])
  return (
    <Stack gap="12px">
      <Text size="18px" weight="semibold">
        accountsChanged
      </Text>
      <Stack gap="8px">
        {accounts.map((x, i) => (
          <Text key={i}>{JSON.stringify(x)}</Text>
        ))}
      </Stack>
    </Stack>
  )
}

function ChainChanged() {
  const { provider } = useContext(Context)

  const [chainIds, setChainIds] = useState<number[]>([])
  useEffect(() => {
    provider.on('chainChanged', (chainId) => {
      setChainIds((chainIds) => [...chainIds, hexToNumber(chainId as Hex)])
    })
  }, [provider])

  return (
    <Stack gap="12px">
      <Text size="18px" weight="semibold">
        chainChanged
      </Text>
      <Text>{JSON.stringify(chainIds)}</Text>
    </Stack>
  )
}

function Connect() {
  const { provider } = useContext(Context)

  const [lastEvent, setLastEvent] = useState<string>('')
  useEffect(() => {
    provider.on('connect', () => {
      setLastEvent('connect')
    })
    provider.on('disconnect', () => {
      setLastEvent('disconnect')
    })
  }, [provider])

  return (
    <Stack gap="12px">
      <Text size="18px" weight="semibold">
        connect/disconnect
      </Text>
      <Text>last event: {lastEvent}</Text>
    </Stack>
  )
}

function RequestAccounts() {
  const { provider } = useContext(Context)

  const [accounts, setAccounts] = useState<Address[]>()

  const requestAccounts = async () => {
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    })
    setAccounts(accounts)
  }

  return (
    <Stack gap="12px">
      <Text size="18px" weight="semibold">
        eth_requestAccounts
      </Text>
      {accounts?.map((account) => (
        <Text key={account}>{account}</Text>
      ))}
      <Button onClick={requestAccounts} width="fit">
        Request
      </Button>
    </Stack>
  )
}

function Accounts() {
  const { provider } = useContext(Context)
  const [accounts, setAccounts] = useState<Address[]>()

  useEffect(() => {
    ;(async () => {
      const accounts = await provider.request({
        method: 'eth_accounts',
      })
      setAccounts(accounts)
    })()
  }, [provider])

  return (
    <Stack gap="12px">
      <Text size="18px" weight="semibold">
        eth_accounts
      </Text>
      {accounts?.map((account) => (
        <Text key={account}>{account}</Text>
      ))}
    </Stack>
  )
}

function BlockNumber() {
  const { provider } = useContext(Context)
  const [blockNumber, setBlockNumber] = useState<Hex>()

  useEffect(() => {
    ;(async () => {
      setBlockNumber(await provider.request({ method: 'eth_blockNumber' }))
    })()
  }, [provider])

  return (
    <Stack gap="12px">
      <Text size="18px" weight="semibold">
        eth_blockNumber
      </Text>
      {blockNumber && <Text>{hexToNumber(blockNumber)}</Text>}
    </Stack>
  )
}

function ChainId() {
  const { provider } = useContext(Context)
  const [chainId, setChainId] = useState<Hex>()

  useEffect(() => {
    ;(async () => {
      setChainId(await provider.request({ method: 'eth_chainId' }))
    })()
  }, [provider])

  return (
    <Stack gap="12px">
      <Text size="18px" weight="semibold">
        eth_chainId
      </Text>
      {chainId && <Text>{hexToNumber(chainId)}</Text>}
    </Stack>
  )
}

function SendTransaction() {
  const { provider } = useContext(Context)

  const [hash, setHash] = useState<Hash | undefined>()
  const [error, setError] = useState<Error>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const data = (formData.get('data') as Hex) || undefined
    const gas = (formData.get('gas') as Hex) || undefined
    const maxFeePerGas = (formData.get('maxFeePerGas') as Hex) || undefined
    const maxPriorityFeePerGas =
      (formData.get('maxPriorityFeePerGas') as Hex) || undefined
    const nonce = (formData.get('nonce') as Hex) || undefined
    const to = (formData.get('to') as Hex) || undefined
    const value = (formData.get('value') as Hex) || undefined

    try {
      const [account] = await window.ethereum!.request({
        method: 'eth_accounts',
      })
      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            data,
            from: account,
            gas,
            maxFeePerGas: maxFeePerGas
              ? numberToHex(parseGwei(maxFeePerGas))
              : undefined,
            maxPriorityFeePerGas: maxPriorityFeePerGas
              ? numberToHex(parseGwei(maxPriorityFeePerGas))
              : undefined,
            nonce,
            to,
            value: value ? numberToHex(parseEther(value)) : undefined,
          },
        ],
      })
      setHash(hash)
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <Stack gap="12px">
      <Text size="18px" weight="semibold">
        eth_sendTransaction
      </Text>
      <Box style={{ maxWidth: '760px' }}>
        <form onSubmit={handleSubmit}>
          <Stack gap="12px">
            <Columns gap="12px">
              <Column>
                <Input
                  defaultValue="0x0000000000000000000000000000000000000000"
                  name="to"
                  placeholder="to"
                />
              </Column>
              <Column width="1/4">
                <Input name="nonce" placeholder="nonce" type="number" />
              </Column>
              <Column width="1/4">
                <Input
                  name="value"
                  placeholder="value (eth)"
                  step="0.001"
                  type="number"
                />
              </Column>
            </Columns>
            <Columns gap="12px">
              <Column>
                <Input name="data" placeholder="data" />
              </Column>
            </Columns>
            <Columns gap="12px">
              <Column>
                <Input name="gas" placeholder="gas" type="number" />
              </Column>
              <Column>
                <Input
                  name="maxFeePerGas"
                  placeholder="maxFeePerGas (gwei)"
                  step="0.001"
                  type="number"
                />
              </Column>
              <Column>
                <Input
                  name="maxPriorityFeePerGas"
                  placeholder="maxPriorityFeePerGas (gwei)"
                  step="0.001"
                  type="number"
                />
              </Column>
            </Columns>
            <Button type="submit" width="fit">
              Send
            </Button>
            {hash && <Text>Tx Hash: {hash}</Text>}
            {error && <Text>Error: {error.message}</Text>}
          </Stack>
        </form>
      </Box>
    </Stack>
  )
}

function SignMessage() {
  const { provider } = useContext(Context)

  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState<Hex | undefined>()
  const [error, setError] = useState<Error>()

  const handleClickSign = async () => {
    if (!message) return

    setSignature(undefined)
    try {
      const signature = await provider.request({
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
    <Stack gap="12px">
      <Text size="18px" weight="semibold">
        eth_signMessage
      </Text>
      <Inline wrap={false} gap="12px">
        <Box style={{ width: '500px' }}>
          <Input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="message"
          />
        </Box>
        <Button onClick={handleClickSign} width="fit">
          Sign
        </Button>
      </Inline>
      {signature && <Text>Signature: {signature}</Text>}
      {error && <Text>Error: {error.message}</Text>}
    </Stack>
  )
}

function SignTypedData() {
  const { provider } = useContext(Context)

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
      const signature = await provider.request({
        method: 'eth_signTypedData_v4',
        params: ['0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', typedData],
      })
      setSignature(signature)
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <Stack gap="12px">
      <Text size="18px" weight="semibold">
        eth_signTypedData_v4
      </Text>
      <Inline wrap={false} gap="12px">
        <Button onClick={handleClickSign} width="fit">
          Sign
        </Button>
      </Inline>
      {signature && <Text>Signature: {signature}</Text>}
      {error && <Text>Error: {error.message}</Text>}
    </Stack>
  )
}

function ContractPlayground() {
  const { client } = useContext(Context)

  const [deployedAddress, setDeployedAddress] = useState<Hex | null>(null)

  const deploy = async () => {
    const [address] = await client.getAddresses()
    const hash = await client.deployContract({
      abi: Playground.abi,
      bytecode: Playground.bytecode.object,
      account: address,
      chain: null,
    })
    const transaction = await client.waitForTransactionReceipt({ hash })
    setDeployedAddress(transaction.contractAddress)
  }

  const test_rivet_1 = async (e: React.FormEvent) => {
    e.preventDefault()
    const [address] = await client.getAddresses()
    await client.writeContract({
      abi: Playground.abi,
      address: deployedAddress!,
      account: address,
      chain: null,
      functionName: 'test_rivet_1',
      args: [1n, true, { x: 1n, y: true }, [{ x: 2n, y: false }]],
    })
  }

  const approve = async (e: React.FormEvent) => {
    e.preventDefault()
    const [address] = await client.getAddresses()
    await client.writeContract({
      abi: Playground.abi,
      address: deployedAddress!,
      account: address,
      chain: null,
      functionName: 'approve',
      args: ['0x04d7478fDF318C3C22cECE62Da9D78ff94807D77', 1n],
    })
  }

  if (!deployedAddress)
    return (
      <Button onClick={deploy} width="fit">
        deploy
      </Button>
    )
  return (
    <Stack gap="12px">
      <Button onClick={test_rivet_1} width="fit">
        test_rivet_1
      </Button>
      <Button onClick={approve} width="fit">
        approve
      </Button>
    </Stack>
  )
}

function ContractMockERC20() {
  const { client } = useContext(Context)

  const [deployedAddress, setDeployedAddress] = useState<Hex | null>(null)

  const deploy = async () => {
    const [address] = await client.getAddresses()
    const hash = await client.deployContract({
      abi: MockERC20.abi,
      bytecode: MockERC20.bytecode.object,
      account: address,
      chain: null,
      args: ['MockERC20', 'M20', 18],
    })
    const transaction = await client.waitForTransactionReceipt({ hash })
    setDeployedAddress(transaction.contractAddress)
  }

  const mint = async (e: React.FormEvent) => {
    e.preventDefault()
    const [address] = await client.getAddresses()
    await client.writeContract({
      abi: MockERC20.abi,
      address: deployedAddress!,
      account: address,
      chain: null,
      functionName: 'mint',
      args: [address, parseEther('1')],
    })
  }

  if (!deployedAddress)
    return (
      <Button onClick={deploy} width="fit">
        deploy
      </Button>
    )
  return (
    <Stack gap="12px">
      <Button onClick={mint} width="fit">
        mint
      </Button>
    </Stack>
  )
}

function ContractMockERC721() {
  const { client } = useContext(Context)

  const [deployedAddress, setDeployedAddress] = useState<Hex | null>(null)

  const deploy = async () => {
    const [address] = await client.getAddresses()
    const hash = await client.deployContract({
      abi: MockERC721.abi,
      bytecode: MockERC721.bytecode.object,
      account: address,
      chain: null,
      args: ['MockERC721', 'M721'],
    })
    const transaction = await client.waitForTransactionReceipt({ hash })
    setDeployedAddress(transaction.contractAddress)
  }

  const mint = async (e: React.FormEvent) => {
    e.preventDefault()
    const [address] = await client.getAddresses()
    await client.writeContract({
      abi: MockERC721.abi,
      address: deployedAddress!,
      account: address,
      chain: null,
      functionName: 'mint',
      args: [address, 69n],
    })
  }

  if (!deployedAddress)
    return (
      <Button onClick={deploy} width="fit">
        deploy
      </Button>
    )
  return (
    <Stack gap="12px">
      <Button onClick={mint} width="fit">
        mint
      </Button>
    </Stack>
  )
}

function useReloadAfterFirstInstall() {
  // Hack to reload page after installing extension on fresh Chrome profile (`bun run chrome`).
  const installed = window.localStorage.getItem('installed')
  useEffect(() => {
    if (installed) return
    setTimeout(() => {
      window.localStorage.setItem('installed', 'true')
      window.location.reload()
    }, 500)
  }, [installed])
  const hasReloaded = Boolean(installed)
  return hasReloaded
}
