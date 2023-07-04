import * as Tabs from '@radix-ui/react-tabs'
import { Fragment, type ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  type Address,
  type Block,
  formatEther,
  hexToBigInt,
  isAddress,
  parseEther,
} from 'viem'

import { Container, TabsContent, TabsList } from '~/components'
import * as Form from '~/components/form'
import {
  Bleed,
  Box,
  Button,
  Columns,
  Inline,
  Input,
  Inset,
  SFSymbol,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useBalance, useNonce, usePublicClient } from '~/hooks'
import { useAccounts } from '~/hooks/useAccounts'
import { useBlock } from '~/hooks/useBlock'
import { useBlocks } from '~/hooks/useBlocks'
import { useCurrentBlock } from '~/hooks/useCurrentBlock'
import { usePrevious } from '~/hooks/usePrevious'
import { useSetBalance } from '~/hooks/useSetBalance'
import { useSetNonce } from '~/hooks/useSetNonce'
import { useSwitchAccount } from '~/hooks/useSwitchAccount'
import { useTxpool } from '~/hooks/useTxpool'
import { truncateAddress } from '~/utils'
import { useAccountStore, useNetworkStore } from '~/zustand'
import type { Account } from '~/zustand/account'

import * as styles from './index.css'
import OnboardingStart from './onboarding/start'

export default function Index() {
  const { onboarded } = useNetworkStore()
  if (!onboarded) return <OnboardingStart />
  return (
    <Container verticalInset={false}>
      <Tabs.Root defaultValue='accounts'>
        <TabsList
          items={[
            { label: 'Accounts', value: 'accounts' },
            { label: 'Blocks', value: 'blocks' },
            { label: 'Txpool', value: 'txpool' },
          ]}
        />
        <TabsContent inset={false} value='accounts'>
          <Accounts />
        </TabsContent>
        <TabsContent inset={false} value='blocks'>
          <Blocks />
        </TabsContent>
        <TabsContent value='txpool'>
          <Txpool />
        </TabsContent>
      </Tabs.Root>
    </Container>
  )
}

////////////////////////////////////////////////////////////////////////
// Accounts

function Accounts() {
  const { account: activeAccount, removeAccount } = useAccountStore()
  const accounts = useAccounts()
  const { mutateAsync: switchAccount } = useSwitchAccount()

  return (
    <>
      <Box alignItems='center' display='flex' style={{ height: '40px' }}>
        <ImportAccount />
      </Box>
      {accounts.map((account) => {
        const active = activeAccount?.address === account.address
        return (
          <Fragment key={account.address}>
            <Box marginHorizontal='-12px'>
              <Separator />
            </Box>
            <Box
              backgroundColor={
                active
                  ? 'surface/fill/tertiary'
                  : { hover: 'surface/fill/quarternary' }
              }
              cursor='pointer'
              onClick={() => switchAccount({ account })}
              marginHorizontal='-12px'
              paddingHorizontal='12px'
              paddingVertical='16px'
              position='relative'
            >
              {active && (
                <Text
                  color='text/secondary'
                  weight='medium'
                  size='9px'
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                  }}
                >
                  ACTIVE
                </Text>
              )}
              <Stack gap='16px'>
                <LabelledContent label='Account'>
                  <Inline gap='4px'>
                    {account.displayName && (
                      <Text size='12px'>{account.displayName}</Text>
                    )}
                    <Text
                      color={account.displayName ? 'text/tertiary' : undefined}
                      size='12px'
                    >
                      {truncateAddress(account.address)}
                    </Text>
                  </Inline>
                </LabelledContent>
                <Columns gap='4px'>
                  <Balance address={account.address} />
                  <Box style={{ width: '50px' }}>
                    <Nonce address={account.address} />
                  </Box>
                </Columns>
              </Stack>
              <Box
                position='absolute'
                style={{ bottom: '16px', right: '12px' }}
              >
                <Inline gap='4px' wrap={false}>
                  {account.impersonate && (
                    <RemoveButton
                      onClick={(e) => {
                        e.stopPropagation()
                        removeAccount({ account })
                      }}
                    />
                  )}
                </Inline>
              </Box>
            </Box>
          </Fragment>
        )
      })}
    </>
  )
}

function ImportAccount() {
  const { addAccount } = useAccountStore()
  const {
    network: { rpcUrl },
  } = useNetworkStore()
  const publicClient = usePublicClient()
  const { mutateAsync: switchAccount } = useSwitchAccount()

  const { handleSubmit, register, reset } = useForm<{ addressOrEns: string }>({
    defaultValues: {
      addressOrEns: '',
    },
  })

  const submit = handleSubmit(async ({ addressOrEns }) => {
    try {
      const address = isAddress(addressOrEns)
        ? addressOrEns
        : await publicClient.getEnsAddress({ name: addressOrEns })
      const displayName = !isAddress(addressOrEns) ? addressOrEns : undefined

      if (!address) {
        reset()
        return
      }

      const account: Account = {
        address,
        displayName,
        impersonate: true,
        rpcUrl,
        type: 'json-rpc',
      }
      addAccount({
        account,
      })
      switchAccount({ account })
    } finally {
      reset()
    }
  })

  return (
    <Form.Root onSubmit={submit} style={{ width: '100%' }}>
      <Inline gap='4px' wrap={false}>
        <Form.InputField
          height='24px'
          hideLabel
          label='Import address'
          placeholder='Import address or ENS name...'
          register={register('addressOrEns')}
        />
        <Button height='24px' variant='stroked fill' width='fit'>
          Import
        </Button>
      </Inline>
    </Form.Root>
  )
}

function RemoveButton({ onClick }: { onClick: (e: any) => void }) {
  return (
    /* TODO: Extract into `IconButton` */
    <Box
      as='button'
      backgroundColor={{
        hover: 'surface/red@0.1',
      }}
      borderColor='surface/red@0.4'
      borderWidth='1px'
      onClick={onClick}
      style={{
        width: '20px',
        height: '20px',
      }}
      transform={{ hoveractive: 'shrink95' }}
    >
      <SFSymbol
        color='surface/red'
        size='11px'
        symbol='trash'
        weight='semibold'
      />
    </Box>
  )
}

function Balance({ address }: { address: Address }) {
  const { data: balance, isSuccess } = useBalance({ address })
  const { mutate } = useSetBalance()

  const [value, setValue] = useState(balance ? formatEther(balance) : '')
  useEffect(() => {
    if (balance) setValue(formatEther(balance))
  }, [balance])

  return (
    <LabelledContent label='Balance (ETH)'>
      {isSuccess ? (
        <Bleed top='-2px'>
          <Input
            onChange={(e) => setValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) =>
              mutate({
                address,
                value: parseEther(e.target.value as `${number}`),
              })
            }
            height='24px'
            value={value}
          />
        </Bleed>
      ) : null}
    </LabelledContent>
  )
}

function Nonce({ address }: { address: Address }) {
  const { data: nonce, isSuccess } = useNonce({ address })
  const { mutate } = useSetNonce()

  const [value, setValue] = useState(nonce?.toString() ?? '0')
  useEffect(() => {
    if (nonce) setValue(nonce?.toString() ?? '0')
  }, [nonce])

  return (
    <LabelledContent label='Nonce'>
      {isSuccess ? (
        <Bleed top='-2px'>
          <Input
            onChange={(e) => setValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            value={value}
            onBlur={(e) =>
              mutate({
                address,
                nonce: Number(e.target.value),
              })
            }
            height='24px'
          />
        </Bleed>
      ) : null}
    </LabelledContent>
  )
}

////////////////////////////////////////////////////////////////////////
// Accounts

function Blocks() {
  const { data: block } = useCurrentBlock()
  const prevBlock = usePrevious(block)

  const { data: infiniteBlocks, fetchNextPage } = useBlocks()
  const blocks = infiniteBlocks?.pages.flat() as Block[] | undefined

  const { data: pendingBlock } = useBlock({ blockTag: 'pending' })

  return (
    <>
      <Box
        marginHorizontal='-12px'
        paddingHorizontal='12px'
        paddingVertical='12px'
        position='relative'
      >
        <Inline wrap={false}>
          <LabelledContent label='Block'>
            <Box style={{ width: '80px' }}>
              {Boolean(pendingBlock?.number) && (
                <Text size='12px'>{pendingBlock?.number?.toString()}</Text>
              )}
            </Box>
          </LabelledContent>
          <LabelledContent label='Timestamp'>
            <Box style={{ width: '148px' }}>
              <Text color='text/tertiary' size='12px'>
                Pending
              </Text>
            </Box>
          </LabelledContent>
          <LabelledContent label='Transactions'>
            <Text size='12px'>{pendingBlock?.transactions.length}</Text>
          </LabelledContent>
        </Inline>
      </Box>
      <Box marginHorizontal='-12px'>
        <Separator />
      </Box>
      {blocks?.map((block, i) => (
        <Fragment key={block.number!.toString()}>
          <Box
            // TODO: fix flash
            className={i === 0 && prevBlock && styles.mineBackground}
            marginHorizontal='-12px'
            paddingHorizontal='12px'
            paddingVertical='12px'
            position='relative'
          >
            <Inline wrap={false}>
              <LabelledContent label='Block'>
                <Box style={{ width: '80px' }}>
                  <Text size='12px'>{block.number!.toString()}</Text>
                </Box>
              </LabelledContent>
              <LabelledContent label='Timestamp'>
                <Box style={{ width: '148px' }}>
                  <Text size='12px'>
                    {new Date(
                      Number(block.timestamp! * 1000n),
                    ).toLocaleString()}
                  </Text>
                </Box>
              </LabelledContent>
              <LabelledContent label='Transactions'>
                <Text size='12px'>{block.transactions.length}</Text>
              </LabelledContent>
            </Inline>
          </Box>
          <Box marginHorizontal='-12px'>
            <Separator />
          </Box>
        </Fragment>
      ))}
      <Inset vertical='12px'>
        <Button
          onClick={() => fetchNextPage()}
          variant='stroked fill'
          width='fit'
        >
          Load more
        </Button>
      </Inset>
    </>
  )
}

////////////////////////////////////////////////////////////////////////
// Txpool

function Txpool() {
  const { data: txpool } = useTxpool()

  return (
    <Stack gap='16px'>
      {txpool?.length === 0 && (
        <Text color='text/tertiary'>Txpool is empty</Text>
      )}
      {txpool?.map(([account, transactions]) => {
        return (
          <>
            <Box key={account}>
              <Stack gap='16px'>
                <LabelledContent label='Account'>
                  <Text size='12px'>{account}</Text>
                </LabelledContent>
                <LabelledContent label='Transactions'>
                  <Stack gap='12px'>
                    {transactions.map(({ transaction }) => (
                      <Inline key={transaction.hash} alignHorizontal='justify'>
                        <Text size='12px'>
                          {truncateAddress(transaction.hash)}
                        </Text>
                        <Text size='12px'>
                          {formatEther(hexToBigInt(transaction.value))} ETH
                        </Text>
                      </Inline>
                    ))}
                  </Stack>
                </LabelledContent>
              </Stack>
            </Box>
            <Separator />
          </>
        )
      })}
    </Stack>
  )
}

function LabelledContent({
  children,
  label,
}: { children: ReactNode; label: string }) {
  return (
    <Stack gap='8px' width='fit'>
      <Text color='text/tertiary' size='9px' wrap={false}>
        {label.toUpperCase()}
      </Text>
      <Box>{children}</Box>
    </Stack>
  )
}
