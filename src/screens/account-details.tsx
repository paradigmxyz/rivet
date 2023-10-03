import * as Tabs from '@radix-ui/react-tabs'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  type Address,
  BaseError,
  formatUnits,
  isAddress,
  parseUnits,
} from 'viem'

import { LabelledContent, TabsContent, TabsList, Tooltip } from '~/components'
import * as Form from '~/components/form'
import { Spinner } from '~/components/svgs'
import {
  Bleed,
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Input,
  Inset,
  Row,
  Rows,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useErc20Balance } from '~/hooks/useErc20Balance'
import { useErc20Metadata } from '~/hooks/useErc20Metadata'
import { useSetErc20Balance } from '~/hooks/useSetErc20Balance'
import { useTokensStore } from '~/zustand/tokens'

export default function AccountDetails() {
  const { address } = useParams()
  const [params, setParams] = useSearchParams({ tab: 'tokens' })
  const navigate = useNavigate()

  if (!address) return null
  return (
    <>
      <Box display="flex" alignItems="center" style={{ height: '40px' }}>
        <Inset horizontal="4px">
          <Inline gap="4px">
            <Button.Symbol
              label="Back"
              onClick={() => navigate(-1)}
              symbol="chevron.left"
              height="24px"
              variant="ghost primary"
            />
            <Box>
              <LabelledContent label="Account">
                <Text size="11px">{address}</Text>
              </LabelledContent>
            </Box>
          </Inline>
        </Inset>
      </Box>
      <Separator />
      <Inset horizontal="8px">
        <Stack gap="8px">
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
                <Tokens accountAddress={address as Address} />
              </TabsContent>
              {/* <TabsContent inset={false} value="nfts">
              <NFTs />
            </TabsContent> */}
            </Box>
          </Tabs.Root>
        </Stack>
      </Inset>
    </>
  )
}

function Tokens({ accountAddress }: { accountAddress: Address }) {
  const { tokens } = useTokensStore()

  if (!accountAddress) return null
  return (
    <Inset vertical="8px">
      <ImportToken accountAddress={accountAddress} />
      <Box style={{ height: '4px' }} />
      <Box style={{ height: '24px' }}>
        <Columns alignHorizontal="justify" gap="4px">
          <Column alignVertical="center" width="content">
            <Text color="text/tertiary" size="9px" wrap={false}>
              TOKEN
            </Text>
          </Column>
          <Column alignVertical="center">
            <Text align="right" color="text/tertiary" size="9px" wrap={false}>
              BALANCE
            </Text>
          </Column>
          <Column width="content">
            <Box style={{ width: '24px' }} />
          </Column>
        </Columns>
      </Box>
      <Bleed horizontal="-8px">
        <Separator />
      </Bleed>
      {/* TODO: Handle empty state. */}
      {tokens[accountAddress]?.map((tokenAddress) => (
        <TokenRow
          accountAddress={accountAddress}
          tokenAddress={tokenAddress}
          key={tokenAddress}
        />
      ))}
    </Inset>
  )
}

function ImportToken({ accountAddress }: { accountAddress: Address }) {
  const { addToken } = useTokensStore()

  const { handleSubmit, register, reset } = useForm<{ address: string }>({
    defaultValues: {
      address: '',
    },
  })

  const submit = handleSubmit(async ({ address }) => {
    try {
      if (!accountAddress || !address || !isAddress(address)) {
        toast.error('Invalid token address')
        reset()
        return
      }

      addToken(address as Address, accountAddress)
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
        <Button height="24px" variant="stroked fill" width="fit" type="submit">
          Import
        </Button>
      </Inline>
    </Form.Root>
  )
}

function TokenRow({
  accountAddress,
  tokenAddress,
}: { accountAddress: Address; tokenAddress: Address }) {
  const { removeToken } = useTokensStore()

  const { data: balance, error: balanceError } = useErc20Balance({
    address: accountAddress,
    tokenAddress,
  })

  const { data, error: metadataError } = useErc20Metadata({
    tokenAddress,
  })

  useEffect(() => {
    if (balanceError) toast.error((balanceError as BaseError).shortMessage)
  }, [balanceError])

  useEffect(() => {
    if (metadataError) toast.error((metadataError as BaseError).shortMessage)
  }, [metadataError])

  const isLoading = !data
  const { name, symbol, decimals } = data || {}

  return (
    <>
      <Inset vertical="12px">
        <Box position="relative">
          <Columns alignVertical="center" gap="4px">
            <Column>
              <Rows gap="8px">
                <Row>
                  {isLoading ? (
                    <Inline alignVertical="center" gap="4px">
                      <Spinner size="11px" />
                      <Text color="text/tertiary" size="12px">
                        Importing...
                      </Text>
                    </Inline>
                  ) : (
                    <Text size="12px">{name}</Text>
                  )}
                </Row>
                <Row>
                  <Inline>
                    <Box style={{ maxWidth: '156px' }}>
                      <Tooltip label={tokenAddress}>
                        <Text.Truncated color="text/tertiary" size="11px">
                          {tokenAddress}
                        </Text.Truncated>
                      </Tooltip>
                    </Box>
                    {symbol && (
                      <Box position="relative">
                        <Box position="absolute" style={{ left: 4, top: -2.5 }}>
                          <Box
                            borderWidth="1px"
                            borderColor="surface/invert@0.2"
                            padding="2px"
                          >
                            <Text color="text/tertiary" size="9px">
                              {symbol}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Inline>
                </Row>
              </Rows>
            </Column>
            <Column>
              {typeof balance === 'bigint' && typeof decimals === 'number' && (
                <BalanceInput
                  address={accountAddress}
                  balance={balance}
                  decimals={decimals}
                  tokenAddress={tokenAddress}
                />
              )}
            </Column>
            <Column width="content">
              <Button.Symbol
                label="Delete"
                symbol="trash"
                height="24px"
                variant="ghost red"
                onClick={(e) => {
                  e.stopPropagation()
                  removeToken(tokenAddress, accountAddress)
                }}
              />
            </Column>
          </Columns>
        </Box>
      </Inset>
      <Box marginHorizontal="-8px">
        <Separator />
      </Box>
    </>
  )
}

function BalanceInput({
  address,
  balance,
  decimals,
  tokenAddress,
}: {
  address: Address
  balance: bigint
  decimals: number
  tokenAddress: Address
}) {
  // TODO: Handle errors when setting balance.
  const { mutate, isPending } = useSetErc20Balance()

  const [value, setValue] = useState(formatUnits(balance, decimals))

  useEffect(() => {
    setValue(formatUnits(balance, decimals))
  }, [balance, decimals])

  return (
    <Box>
      <Columns alignVertical="center" alignHorizontal="right" gap="8px">
        {isPending && (
          <Column alignHorizontal="right" width="1/5">
            <Spinner size="15px" />
          </Column>
        )}
        <Column width="4/5">
          <Input
            onChange={(e) => setValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => {
              const newValue = parseUnits(
                e.target.value as `${number}`,
                decimals,
              )
              if (newValue !== balance) {
                mutate({
                  address,
                  tokenAddress,
                  value: newValue,
                })
              }
            }}
            height="24px"
            style={{ textAlign: 'right' }}
            value={value}
          />
        </Column>
      </Columns>
    </Box>
  )
}
