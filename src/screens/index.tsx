import * as Tabs from '@radix-ui/react-tabs'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { Link, useSearchParams } from 'react-router-dom'
import {
  type Address,
  type Hex,
  type Transaction,
  formatEther,
  isAddress,
  parseEther,
} from 'viem'

import {
  Container,
  LabelledContent,
  TabsContent,
  TabsList,
  Tooltip,
} from '~/components'
import * as Form from '~/components/form'
import {
  Bleed,
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Input,
  Inset,
  SFSymbol,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useAccounts } from '~/hooks/useAccounts'
import { useBalance } from '~/hooks/useBalance'
import { useClient } from '~/hooks/useClient'
import { useDebounce } from '~/hooks/useDebounce'
import { useInfiniteBlockTransactions } from '~/hooks/useInfiniteBlockTransactions'
import { useInfiniteBlocks } from '~/hooks/useInfiniteBlocks'
import { useNonce } from '~/hooks/useNonce'
import { usePendingBlock } from '~/hooks/usePendingBlock'
import { usePendingTransactions } from '~/hooks/usePendingTransactions'
import { useSetAccount } from '~/hooks/useSetAccount'
import { useSetBalance } from '~/hooks/useSetBalance'
import { useSetNonce } from '~/hooks/useSetNonce'
import { useTransaction } from '~/hooks/useTransaction'
import { truncate } from '~/utils'
import {
  useAccountStore,
  useNetworkStore,
  useScrollPositionStore,
} from '~/zustand'
import type { Account } from '~/zustand/account'

import OnboardingStart from './onboarding/start'

export default function Index() {
  const { setPosition } = useScrollPositionStore()
  const [params, setParams] = useSearchParams({ tab: 'accounts' })
  const { onboarded } = useNetworkStore()
  if (!onboarded) return <OnboardingStart />
  return (
    <Container scrollable={false} verticalInset={false}>
      <Tabs.Root asChild value={params.get('tab')!}>
        <Box display="flex" flexDirection="column" height="full">
          <TabsList
            items={[
              { label: 'Accounts', value: 'accounts' },
              { label: 'Blocks', value: 'blocks' },
              { label: 'Transactions', value: 'transactions' },
            ]}
            onSelect={(item) => {
              setParams({ tab: item.value })
              setPosition(0)
            }}
          />
          <TabsContent inset={false} value="accounts">
            <Accounts />
          </TabsContent>
          <TabsContent inset={false} value="blocks">
            <Blocks />
          </TabsContent>
          <TabsContent inset={false} scrollable="auto" value="transactions">
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
  const { mutateAsync: setAccount } = useSetAccount()

  return (
    <>
      <Box alignItems="center" display="flex" style={{ height: '40px' }}>
        <ImportAccount />
      </Box>
      {accounts.map((account) => {
        const active = activeAccount?.address === account.address
        return (
          <Fragment key={account.address}>
            <Box marginHorizontal="-8px">
              <Separator />
            </Box>
            <Box
              backgroundColor={active ? 'surface/fill/tertiary' : undefined}
              marginHorizontal="-8px"
              paddingHorizontal="8px"
              paddingVertical="12px"
              position="relative"
            >
              {active && (
                <Text
                  color="text/secondary"
                  weight="medium"
                  size="9px"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                  }}
                >
                  ACTIVE
                </Text>
              )}
              <Stack gap="16px">
                <LabelledContent label="Account">
                  <Box width="fit" position="relative">
                    <Inline gap="4px">
                      {account.displayName && (
                        <Text size="12px">{account.displayName}</Text>
                      )}
                      <Tooltip label={account.address}>
                        <Text
                          color={
                            account.displayName ? 'text/tertiary' : undefined
                          }
                          size="12px"
                        >
                          {account.displayName
                            ? truncate(account.address)
                            : account.address}
                        </Text>
                      </Tooltip>
                      <Box position="absolute" style={{ right: -24, top: -6 }}>
                        <Button.Symbol
                          symbol="doc.on.doc"
                          height="20px"
                          onClick={() =>
                            navigator.clipboard.writeText(account.address)
                          }
                          variant="ghost primary"
                        />
                      </Box>
                    </Inline>
                  </Box>
                </LabelledContent>
                <Columns gap="4px">
                  <Balance address={account.address} />
                  <Box style={{ width: '50px' }}>
                    <Nonce address={account.address} />
                  </Box>
                </Columns>
              </Stack>
              <Box
                position="absolute"
                style={{ bottom: '12px', right: '12px' }}
              >
                <Inline gap="4px" wrap={false}>
                  {account.impersonate && (
                    <Button.Symbol
                      symbol="trash"
                      height="24px"
                      variant="stroked red"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeAccount({ account })
                      }}
                    />
                  )}
                  {!active && (
                    <Button.Symbol
                      height="24px"
                      onClick={() => setAccount({ account })}
                      symbol="arrow.left.arrow.right"
                      variant={active ? 'solid invert' : 'stroked fill'}
                    />
                  )}
                  <Link to={`account/${account.address}`}>
                    <Box style={{ width: active ? '52px' : '24px' }}>
                      <Button.Symbol
                        height="24px"
                        width="full"
                        onClick={() => {}}
                        symbol="arrow.right"
                        variant={active ? 'solid invert' : 'stroked fill'}
                      />
                    </Box>
                  </Link>
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
  const {
    network: { rpcUrl },
  } = useNetworkStore()
  const client = useClient()
  const { mutateAsync: setAccount } = useSetAccount()

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
      setAccount({ account })
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
          placeholder="Import address or ENS name..."
          register={register('addressOrEns')}
        />
        <Button height="24px" variant="stroked fill" width="fit">
          Import
        </Button>
      </Inline>
    </Form.Root>
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
    <LabelledContent label="Balance (ETH)">
      {isSuccess ? (
        <Bleed top="-2px">
          <Input
            onChange={(e) => setValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) =>
              mutate({
                address,
                value: parseEther(e.target.value as `${number}`),
              })
            }
            height="24px"
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
    <LabelledContent label="Nonce">
      {isSuccess ? (
        <Bleed top="-2px">
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
            height="24px"
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
  const {
    data: infiniteBlocks,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteBlocks()
  const blocks = [
    { block: pendingBlock, status: 'pending' },
    ...(infiniteBlocks?.pages
      .flat()
      ?.map((block) => ({ block, status: 'mined' })) || []),
  ]

  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: blocks.length,
    getScrollElement: () => parentRef.current!,
    estimateSize: () => 40,
  })

  const { position, setPosition } = useScrollPositionStore()
  useEffect(() => {
    parentRef.current?.scrollTo({ top: position })
  }, [position])

  const { ref, inView } = useInView()
  useEffect(() => {
    if (isFetching) return
    if (isFetchingNextPage) return
    if (inView) fetchNextPage()
  }, [fetchNextPage, inView, isFetching, isFetchingNextPage])

  return (
    <Box
      ref={parentRef}
      marginHorizontal="-8px"
      style={{ height: '100%', overflowY: 'scroll' }}
    >
      <Box
        position="relative"
        width="full"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map(({ key, index, size, start }) => {
          const { block, status } = blocks[index] || {}
          if (!block) return
          return (
            <Link
              onClick={() => setPosition(parentRef.current?.scrollTop!)}
              to={`block/${block.number}?status=${status}`}
              key={key}
            >
              <VirtualItem size={size} start={start}>
                <Box
                  backgroundColor={{ hover: 'surface/fill/quarternary' }}
                  paddingHorizontal="8px"
                  paddingVertical="8px"
                >
                  <Inline wrap={false}>
                    <LabelledContent label="Block">
                      <Box style={{ width: '80px' }}>
                        <Text size="12px">{block.number!.toString()}</Text>
                      </Box>
                    </LabelledContent>
                    <LabelledContent label="Timestamp">
                      <Box style={{ width: '148px' }}>
                        {status === 'pending' ? (
                          <Text color="text/tertiary" size="12px">
                            Pending
                          </Text>
                        ) : (
                          <Text size="12px">
                            {new Date(
                              Number(block.timestamp! * 1000n),
                            ).toLocaleString()}
                          </Text>
                        )}
                      </Box>
                    </LabelledContent>
                    <LabelledContent label="Transactions">
                      <Text size="12px">
                        {block.transactions.length || '0'}
                      </Text>
                    </LabelledContent>
                  </Inline>
                </Box>
                <Box marginHorizontal="-8px">
                  <Separator />
                </Box>
              </VirtualItem>
            </Link>
          )
        })}
      </Box>
      <Inset space="12px">
        <Box ref={ref}>
          {(isFetching || isFetchingNextPage) && (
            <Text color="text/tertiary">Loading...</Text>
          )}
        </Box>
      </Inset>
    </Box>
  )
}

////////////////////////////////////////////////////////////////////////
// Transactions

const numberIntl4SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 4,
})

function Transactions() {
  const { data: pendingTransactions } = usePendingTransactions()
  const {
    data: infiniteBlockTransactions,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteBlockTransactions()
  const blockTransactions = useMemo(
    () => [
      ...(pendingTransactions?.map((transaction) => ({
        transaction,
        status: 'pending',
      })) || []),
      ...((infiniteBlockTransactions?.pages.flat() as Transaction[])?.map(
        (transaction) => ({
          transaction,
          status: 'mined',
        }),
      ) || []),
    ],
    [pendingTransactions, infiniteBlockTransactions],
  )

  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText)

  const { data: transaction, isLoading } = useTransaction({
    enabled: debouncedSearchText.length >= 64,
    hash: debouncedSearchText as Hex,
  })

  // Derived transactions based from filters (only hash search right now - soon: filter by account).
  const transactions = useMemo(() => {
    if (transaction) return [{ transaction, status: 'mined' }]

    // If we have no valid search text, return all transactions.
    if (!debouncedSearchText) return blockTransactions

    // If we have some search text, try and find transaction in list.
    const filteredTransaction = blockTransactions.find(
      ({ transaction }) => transaction.hash === debouncedSearchText,
    )
    if (filteredTransaction) return [filteredTransaction]

    return []
  }, [blockTransactions, debouncedSearchText, transaction])

  const isEmpty = isFetched && transactions.length === 0

  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: transactions.length + (isLoading || isEmpty ? 2 : 1),
    getScrollElement: () => parentRef.current!,
    estimateSize: () => 40,
  })

  const { position, setPosition } = useScrollPositionStore()
  useEffect(() => {
    parentRef.current?.scrollTo({ top: position })
  }, [position])

  const { ref, inView } = useInView()
  useEffect(() => {
    if (isFetching) return
    if (isFetchingNextPage) return
    if (inView) fetchNextPage()
  }, [fetchNextPage, inView, isFetching, isFetchingNextPage])

  return (
    <>
      <Box
        ref={parentRef}
        marginHorizontal="-8px"
        style={{ height: '100%', overflowY: 'scroll' }}
      >
        <Box
          position="relative"
          width="full"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map(({ key, index, size, start }) => {
            if (index === 0) {
              return (
                <VirtualItem key={key} size={size} start={start}>
                  <Box
                    display="flex"
                    alignItems="center"
                    height="full"
                    paddingHorizontal="8px"
                  >
                    <Input
                      height="24px"
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search by transaction hash..."
                      value={searchText}
                    />
                  </Box>
                </VirtualItem>
              )
            }
            if (index === 1) {
              if (isLoading)
                return (
                  <VirtualItem key={key} size={size} start={start}>
                    <Box display="flex" height="full" padding="8px">
                      <Text color="text/secondary" size="14px">
                        Loading...
                      </Text>
                    </Box>
                  </VirtualItem>
                )
              if (isEmpty)
                return (
                  <VirtualItem key={key} size={size} start={start}>
                    <Box display="flex" height="full" padding="8px">
                      <Text color="text/secondary" size="14px">
                        No transactions found by search text "
                        <Text color="text" wrap="anywhere">
                          {debouncedSearchText}
                        </Text>
                        ".
                      </Text>
                    </Box>
                  </VirtualItem>
                )
            }

            const { transaction, status } = transactions[index - 1] || {}
            if (!transaction || typeof transaction === 'string') return
            return (
              <Link
                key={key}
                onClick={() => setPosition(parentRef.current?.scrollTop!)}
                to={`/transaction/${transaction.hash}`}
              >
                <VirtualItem size={size} start={start}>
                  <Box marginHorizontal="-8px">
                    <Separator />
                  </Box>
                  <Box
                    backgroundColor={{ hover: 'surface/fill/quarternary' }}
                    paddingHorizontal="8px"
                    paddingVertical="8px"
                  >
                    <Columns gap="6px" alignVertical="center">
                      <LabelledContent label="Block">
                        <Inline alignVertical="center" gap="4px" wrap={false}>
                          <Text size="12px">
                            {transaction.blockNumber?.toString()}
                          </Text>
                          {status === 'pending' && (
                            <SFSymbol
                              color="text/tertiary"
                              size="11px"
                              symbol="clock"
                              weight="semibold"
                            />
                          )}
                        </Inline>
                      </LabelledContent>
                      <LabelledContent label="From">
                        <Tooltip label={transaction.from}>
                          <Text.Truncated end={5} size="12px">
                            {transaction.from}
                          </Text.Truncated>
                        </Tooltip>
                      </LabelledContent>
                      <LabelledContent label="To">
                        <Tooltip label={transaction.to}>
                          <Text.Truncated end={5} size="12px">
                            {transaction.to}
                          </Text.Truncated>
                        </Tooltip>
                      </LabelledContent>
                      <Column>
                        <Box
                          display="flex"
                          alignItems="flex-end"
                          justifyContent="flex-end"
                        >
                          <LabelledContent label="Value">
                            <Text wrap={false} size="12px">
                              {numberIntl4SigFigs.format(
                                Number(formatEther(transaction.value!)),
                              )}{' '}
                              <Text color="text/tertiary">ETH</Text>
                            </Text>
                          </LabelledContent>
                        </Box>
                      </Column>
                    </Columns>
                  </Box>
                </VirtualItem>
              </Link>
            )
          })}
        </Box>
        {!debouncedSearchText && (
          <Inset space="12px">
            <Box ref={ref}>
              {(isFetching || isFetchingNextPage) && (
                <Text color="text/tertiary">Loading...</Text>
              )}
            </Box>
          </Inset>
        )}
      </Box>
    </>
  )
}

function VirtualItem({
  children,
  size,
  start,
  ...props
}: { children: React.ReactNode; size: number; start: number }) {
  return (
    <Box
      position="absolute"
      top="0px"
      left="0px"
      width="full"
      style={{
        height: `${size}px`,
        transform: `translateY(${start}px)`,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
