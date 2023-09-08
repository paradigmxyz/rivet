import * as Tabs from '@radix-ui/react-tabs'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type Address, formatEther, parseEther } from 'viem'

import {
  Container,
  LabelledContent,
  TabsContent,
  TabsList,
  Tooltip,
} from '~/components'
import * as Form from '~/components/form'
import {
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Input,
  Inset,
  Row,
  Rows,
  SFSymbol,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useAccountStore } from '~/zustand'

import { useEffect, useState } from 'react'
import { useErcBalance } from '~/hooks/useErcBalance'
import { useSetErcBalance } from '~/hooks/useSetErcBalance'
import { truncate } from '~/utils'
import { useTokensStore } from '~/zustand/tokens'

function Account() {
  const { account } = useAccountStore()
  if (!account) return null

  return (
    <LabelledContent label={'Address'}>
      <Text size="12px">{account.address}</Text>
    </LabelledContent>
  )
}

export default function TokenConfig() {
  const [params, setParams] = useSearchParams({ tab: 'tokens' })
  const navigate = useNavigate()
  return (
    <Container scrollable={false} dismissable fit>
      <Stack gap="8px">
        <Inline wrap={false} gap="12px">
          <Box cursor="pointer" onClick={() => navigate('/')}>
            <SFSymbol
              color="text/tertiary"
              size="12px"
              symbol="xmark"
              weight="medium"
            />
          </Box>
          <Account />
        </Inline>
        <Inset horizontal="12px">
          <Separator />
        </Inset>
        <Tabs.Root asChild value={params.get('tab')!}>
          <Box display="flex" flexDirection="column" height="full">
            <TabsList
              items={[
                { label: 'Tokens', value: 'tokens' },
                // { label: 'NFTs', value: 'nfts' },
              ]}
              onSelect={(item) => {
                setParams({ tab: item.value })
              }}
            />
            <TabsContent inset={false} value="tokens">
              <Tokens />
            </TabsContent>
            {/* <TabsContent inset={false} value="nfts">
              <NFTs />
            </TabsContent> */}
          </Box>
        </Tabs.Root>
      </Stack>
    </Container>
  )
}

function ImportAccount() {
  const { addToken } = useTokensStore()

  const { handleSubmit, register, reset } = useForm<{ address: string }>({
    defaultValues: {
      address: '',
    },
  })

  const submit = handleSubmit(async ({ address }) => {
    try {
      if (!address) {
        reset()
        return
      }

      addToken(address as Address)
    } finally {
      reset()
    }
  })

  return (
    <Form.Root onSubmit={submit} style={{ width: '100%' }}>
      <Inline gap="4px" wrap={false}>
        <Form.InputField
          height="24px"
          hideLabel
          label="Import address"
          placeholder="Import address"
          register={register('address')}
        />
        <Button height="24px" variant="stroked fill" width="fit">
          Add
        </Button>
      </Inline>
    </Form.Root>
  )
}

function RemoveButton({ onClick }: { onClick: (e: any) => void }) {
  return (
    <Box
      as="button"
      backgroundColor={{
        hover: 'surface/red@0.1',
      }}
      borderColor="surface/invert@0.2"
      borderWidth="1px"
      borderRadius="3px"
      onClick={onClick}
      style={{ width: '24px', height: '24px' }}
      transform={{ hoveractive: 'shrink95' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="full"
    >
      <SFSymbol color="surface/red" symbol="xmark" size="9px" />
    </Box>
  )
}

function Balance({
  erc,
  address,
  balance,
}: { erc: Address; address: Address; balance: bigint }) {
  const { mutate } = useSetErcBalance()

  const [value, setValue] = useState(balance ? formatEther(balance) : '')
  useEffect(() => {
    if (balance) setValue(formatEther(balance))
  }, [balance])

  return (
    <Input
      onChange={(e) => setValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onBlur={(e) => {
        const newValue = parseEther(e.target.value as `${number}`)
        if (newValue !== balance) {
          mutate({
            address,
            erc,
            value: newValue,
          })
        }
      }}
      height="24px"
      value={value}
    />
  )
}

function TokenBalance({ token }: { token: Address }) {
  const { account } = useAccountStore()
  if (!account) return null

  const { data, isSuccess } = useErcBalance({
    address: account.address,
    erc: token,
  })
  const { removeToken } = useTokensStore()

  if (!isSuccess) return null
  const [name, symbol, decimals, balance] = data

  return (
    <Box position="relative">
      <Columns alignVertical="center" gap="4px">
        <Column>
          <Tooltip label={`${token}, ${decimals} dec`}>
            <Rows gap="8px">
              <Row>
                <Text weight="medium" size="14px">
                  {name}
                </Text>
              </Row>
              <Row>
                <Inline alignVertical="center" alignHorizontal="left" gap="2px">
                  <Text size="11px">
                    {truncate(token, { start: 6, end: 4 })}
                  </Text>
                  <Box
                    borderWidth="1px"
                    borderColor="surface/invert@0.2"
                    padding="2px"
                  >
                    <Text size="11px">{symbol}</Text>
                  </Box>
                </Inline>
              </Row>
            </Rows>
          </Tooltip>
        </Column>
        <Column width="content">
          <Balance erc={token} address={account.address} balance={balance} />
        </Column>
        <Column width="content">
          <RemoveButton
            onClick={(e) => {
              e.stopPropagation()
              removeToken(token)
            }}
          />
        </Column>
      </Columns>
    </Box>
  )
}

function Tokens() {
  const { account } = useAccountStore()
  if (!account) return null

  const { tokens } = useTokensStore()
  return (
    <>
      <Box alignItems="center" display="flex" style={{ height: '40px' }}>
        <ImportAccount />
      </Box>
      <Stack gap="12px">
        <Columns alignHorizontal="justify">
          <Column alignVertical="center" width="content">
            <Text color="text/tertiary" size="9px" wrap={false}>
              TOKEN
            </Text>
          </Column>
          <Column alignVertical="center" width="content">
            <Text color="text/tertiary" size="9px" wrap={false}>
              BALANCE
            </Text>
          </Column>
        </Columns>
        <Separator />
        {tokens.map((token) => {
          return (
            <Columns key={token}>
              <TokenBalance token={token} />
            </Columns>
          )
        })}
      </Stack>
    </>
  )
}
