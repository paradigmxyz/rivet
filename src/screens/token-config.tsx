import * as Tabs from '@radix-ui/react-tabs'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type Address, formatUnits, isAddress, parseUnits } from 'viem'

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
import { useErc20Balance } from '~/hooks/useErc20Balance'
import { useErc20Metadata } from '~/hooks/useErc20Metadata'
import { useSetErc20Balance } from '~/hooks/useSetErc20Balance'
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
    <Container dismissable fit>
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
  const { account } = useAccountStore()

  const { handleSubmit, register, reset } = useForm<{ address: string }>({
    defaultValues: {
      address: '',
    },
  })

  const submit = handleSubmit(async ({ address }) => {
    try {
      if (!account || !address || !isAddress(address)) {
        reset()
        return
      }

      addToken(address as Address, account.address)
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
          label="Import token address"
          placeholder="Import token address"
          register={register('address')}
        />
        <Button height="24px" variant="stroked fill" width="fit">
          Import
        </Button>
      </Inline>
    </Form.Root>
  )
}

function RemoveButton({ onClick }: { onClick: (e: any) => void }) {
  return (
    <Button.Symbol
      symbol="xmark"
      height="24px"
      variant="stroked red"
      onClick={onClick}
    />
  )
}

function Balance({
  tokenAddress,
  address,
  balance,
  decimals,
}: {
  tokenAddress: Address
  address: Address
  balance: bigint | undefined
  decimals: number
}) {
  const { mutate } = useSetErc20Balance()

  const [value, setValue] = useState(
    balance ? formatUnits(balance, decimals) : '',
  )

  useEffect(() => {
    if (balance) setValue(formatUnits(balance, decimals))
    else setValue('')
  }, [balance, decimals])

  return (
    <Input
      onChange={(e) => setValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onBlur={(e) => {
        const newValue = parseUnits(e.target.value as `${number}`, decimals)
        if (newValue !== balance) {
          mutate({
            address,
            tokenAddress,
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
  const { removeToken } = useTokensStore()
  const { data: balance } = useErc20Balance({
    address: account!.address,
    tokenAddress: token,
  })
  const { data, isSuccess: isSuccessMetadata } = useErc20Metadata({
    tokenAddress: token,
  })

  if (!isSuccessMetadata) {
    return (
      <Inset top="8px">
        <Columns alignVertical="center" gap="4px">
          <Column>
            <Text size="11px">{truncate(token, { start: 6, end: 4 })}</Text>
          </Column>
          <Column width="content">
            <RemoveButton
              onClick={(e) => {
                e.stopPropagation()
                removeToken(token, account!.address)
              }}
            />
          </Column>
        </Columns>
      </Inset>
    )
  }

  const [name, symbol, decimals] = data

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
          <Balance
            tokenAddress={token}
            address={account!.address}
            balance={balance}
            decimals={decimals}
          />
        </Column>
        <Column width="content">
          <RemoveButton
            onClick={(e) => {
              e.stopPropagation()
              removeToken(token, account!.address)
            }}
          />
        </Column>
      </Columns>
    </Box>
  )
}

function TokensList() {
  const { tokens } = useTokensStore()
  const { account } = useAccountStore()

  if (!account) return null

  return (
    <>
      {(tokens[account.address] || []).map((token) => {
        return (
          <Columns key={token}>
            <TokenBalance token={token} />
          </Columns>
        )
      })}
    </>
  )
}

function Tokens() {
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
        <TokensList />
      </Stack>
    </>
  )
}
