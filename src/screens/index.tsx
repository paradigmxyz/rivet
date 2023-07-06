import * as Tabs from '@radix-ui/react-tabs'
import { useVirtualizer } from '@tanstack/react-virtual'
import { format } from 'd3-format'
import { Fragment, type ReactNode, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import {
  type Address,
  type Transaction,
  formatEther,
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
import { useBalance, useNonce } from '~/hooks'
import { useAccounts } from '~/hooks/useAccounts'
import { useBlocks } from '~/hooks/useBlocks'
import { useClient } from '~/hooks/useClient'
import { usePendingBlock } from '~/hooks/usePendingBlock'
import { usePendingTransactions } from '~/hooks/usePendingTransactions'
import { useSetBalance } from '~/hooks/useSetBalance'
import { useSetNonce } from '~/hooks/useSetNonce'
import { useSwitchAccount } from '~/hooks/useSwitchAccount'
import { useTransactions } from '~/hooks/useTransactions'
import { truncate } from '~/utils'
import { useAccountStore, useNetworkStore } from '~/zustand'
import type { Account } from '~/zustand/account'

import OnboardingStart from './onboarding/start'

export default function Index() {
  const { onboarded } = useNetworkStore()
  if (!onboarded) return <OnboardingStart />
  return (
    <Container scrollable={false} verticalInset={false}>
      <Tabs.Root asChild defaultValue='accounts'>
        <Box display='flex' flexDirection='column' height='full'>
          <TabsList
            items={[
              { label: 'Accounts', value: 'accounts' },
              { label: 'Blocks', value: 'blocks' },
              { label: 'Transactions', value: 'transactions' },
            ]}
          />
          <TabsContent inset={false} value='accounts'>
            <Accounts />
          </TabsContent>
          <TabsContent inset={false} value='blocks'>
            <Blocks />
          </TabsContent>
          <TabsContent inset={false} scrollable={false} value='transactions'>
            <Transactions />
          </TabsContent>
        </Box>
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
                      {truncate(account.address)}
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
  const client = useClient()
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
        : await client.getEnsAddress({ name: addressOrEns })
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
        width: '24px',
        height: '24px',
      }}
      transform={{ hoveractive: 'shrink95' }}
    >
      <SFSymbol
        color='surface/red'
        size='12px'
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
// Blocks

function Blocks() {
  const { data: pendingBlock } = usePendingBlock()
  const { data: infiniteBlocks, fetchNextPage } = useBlocks()
  const blocks = [
    { block: pendingBlock, status: 'pending' },
    ...(infiniteBlocks?.pages
      .flat()
      ?.map((block) => ({ block, status: 'mined' })) || []),
  ]

  const parentRef = useRef(null)
  const virtualizer = useVirtualizer({
    count: blocks.length,
    getScrollElement: () => parentRef.current!,
    estimateSize: () => 40,
  })

  const { ref, inView } = useInView()
  useEffect(() => {
    if (inView) fetchNextPage()
  }, [fetchNextPage, inView])

  return (
    <Box
      ref={parentRef}
      marginHorizontal='-12px'
      style={{ height: '100%', overflowY: 'scroll' }}
    >
      <Box
        position='relative'
        width='full'
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map(({ key, index, size, start }) => {
          const { block, status } = blocks[index] || {}
          if (!block) return
          return (
            <Box
              key={key}
              backgroundColor={{ hover: 'surface/fill/quarternary' }}
              position='absolute'
              top='0px'
              left='0px'
              width='full'
              style={{
                height: `${size}px`,
                transform: `translateY(${start}px)`,
              }}
            >
              <Box paddingHorizontal='12px' paddingVertical='8px'>
                <Inline wrap={false}>
                  <LabelledContent label='Block'>
                    <Box style={{ width: '80px' }}>
                      <Text size='12px'>{block.number!.toString()}</Text>
                    </Box>
                  </LabelledContent>
                  <LabelledContent label='Timestamp'>
                    <Box style={{ width: '148px' }}>
                      {status === 'pending' ? (
                        <Text color='text/tertiary' size='12px'>
                          Pending
                        </Text>
                      ) : (
                        <Text size='12px'>
                          {new Date(
                            Number(block.timestamp! * 1000n),
                          ).toLocaleString()}
                        </Text>
                      )}
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
            </Box>
          )
        })}
      </Box>
      <Inset space='12px'>
        <Box ref={ref}>
          <Text color='text/tertiary'>Loading...</Text>
        </Box>
      </Inset>
    </Box>
  )
}

////////////////////////////////////////////////////////////////////////
// Transactions

function Transactions() {
  const { data: pendingTransactions } = usePendingTransactions()
  const { data: infiniteTransactions, fetchNextPage } = useTransactions()
  const transactions = [
    ...(pendingTransactions?.map((transaction) => ({
      transaction,
      status: 'pending',
    })) || []),
    ...((infiniteTransactions?.pages.flat() as Transaction[])?.map(
      (transaction) => ({ transaction, status: 'mined' }),
    ) || []),
  ]

  const parentRef = useRef(null)
  const virtualizer = useVirtualizer({
    count: (pendingTransactions?.length ?? 0) + (transactions?.length ?? 0),
    getScrollElement: () => parentRef.current!,
    estimateSize: () => 40,
  })

  const { ref, inView } = useInView()
  useEffect(() => {
    if (inView) fetchNextPage()
  }, [fetchNextPage, inView])

  return (
    <Box
      ref={parentRef}
      marginHorizontal='-12px'
      style={{ height: '100%', overflowY: 'scroll' }}
    >
      <Box
        position='relative'
        width='full'
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map(({ key, index, size, start }) => {
          const { transaction, status } = transactions[index] || {}
          if (!transaction || typeof transaction === 'string') return
          return (
            <Box
              key={key}
              backgroundColor={{ hover: 'surface/fill/quarternary' }}
              position='absolute'
              top='0px'
              left='0px'
              width='full'
              style={{
                height: `${size}px`,
                transform: `translateY(${start}px)`,
              }}
            >
              <Box paddingHorizontal='12px' paddingVertical='8px'>
                <Columns alignVertical='center'>
                  <LabelledContent label='Block'>
                    <Inline alignVertical='center' gap='4px' wrap={false}>
                      <Text size='12px'>
                        {transaction.blockNumber?.toString()}
                      </Text>
                      {status === 'pending' && (
                        <SFSymbol
                          color='text/tertiary'
                          size='11px'
                          symbol='clock'
                          weight='semibold'
                        />
                      )}
                    </Inline>
                  </LabelledContent>
                  <LabelledContent label='From'>
                    <Text wrap={false} size='12px'>
                      {truncate(transaction.from, { start: 6, end: 4 })}
                    </Text>
                  </LabelledContent>
                  <LabelledContent label='To'>
                    <Text wrap={false} size='12px'>
                      {transaction.to &&
                        truncate(transaction.to, { start: 6, end: 4 })}
                    </Text>
                  </LabelledContent>
                  <LabelledContent label='Value'>
                    <Text wrap={false} size='12px'>
                      {format('.3')(parseFloat(formatEther(transaction.value)))}{' '}
                      ETH
                    </Text>
                  </LabelledContent>
                </Columns>
              </Box>
              <Box marginHorizontal='-12px'>
                <Separator />
              </Box>
            </Box>
          )
        })}
      </Box>
      <Inset space='12px'>
        <Box ref={ref}>
          <Text color='text/tertiary'>Loading...</Text>
        </Box>
      </Inset>
    </Box>
  )
}

function LabelledContent({
  children,
  label,
}: { children: ReactNode; label: string }) {
  return (
    <Stack gap='8px'>
      <Text color='text/tertiary' size='9px' wrap={false}>
        {label.toUpperCase()}
      </Text>
      <Box>{children}</Box>
    </Stack>
  )
}
