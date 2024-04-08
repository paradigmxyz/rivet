import * as Tabs from '@radix-ui/react-tabs'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  type Address,
  type Block,
  type Hex,
  type Transaction,
  formatEther,
  isAddress,
  parseEther,
} from 'viem'

import {
  Container,
  LabelledContent,
  LoadMore,
  TabsContent,
  TabsList,
  Tooltip,
  useVirtualList,
} from '~/components'
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
  SFSymbol,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useAccounts } from '~/hooks/useAccounts'
import { useBalance } from '~/hooks/useBalance'
import { useClient } from '~/hooks/useClient'
import { useContracts } from '~/hooks/useContracts'
import { useDebounce } from '~/hooks/useDebounce'
import { useInfiniteBlockTransactions } from '~/hooks/useInfiniteBlockTransactions'
import { useInfiniteBlocks } from '~/hooks/useInfiniteBlocks'
import { useNonce } from '~/hooks/useNonce'
import { usePendingBlock } from '~/hooks/usePendingBlock'
import { usePendingTransactions } from '~/hooks/usePendingTransactions'
import { useSearchParamsState } from '~/hooks/useSearchParamsState'
import { useSetAccount } from '~/hooks/useSetAccount'
import { useSetBalance } from '~/hooks/useSetBalance'
import { useSetNonce } from '~/hooks/useSetNonce'
import { useTransaction } from '~/hooks/useTransaction'
import { isDomain, truncate } from '~/utils'
import {
  useAccountStore,
  useNetworkStore,
  useScrollPositionStore,
} from '~/zustand'
import type { Account } from '~/zustand/account'

import { useRevert } from '../hooks/useRevert'
import { useSnapshot } from '../hooks/useSnapshot'
import OnboardingStart from './onboarding/start'

export default function Index() {
  const defaultTab = 'accounts'

  const { setPosition } = useScrollPositionStore()
  const [params, setParams] = useSearchParams({ tab: defaultTab })
  const { onboarded } = useNetworkStore()
  if (!onboarded) return <OnboardingStart />
  return (
    <Container scrollable={false} verticalInset={false}>
      <Tabs.Root asChild value={params.get('tab') || defaultTab}>
        <Box display="flex" flexDirection="column" height="full">
          <TabsList
            items={[
              { label: 'Accounts', value: 'accounts' },
              { label: 'Blocks', value: 'blocks' },
              { label: 'Transactions', value: 'transactions' },
              { label: 'Contracts', value: 'contracts' },
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
          <TabsContent inset={false} scrollable="auto" value="contracts">
            <Contracts />
          </TabsContent>
        </Box>
      </Tabs.Root>
    </Container>
  )
}

////////////////////////////////////////////////////////////////////////
// Accounts

function Accounts() {
  const accounts = useAccounts()

  return (
    <>
      <Box alignItems="center" display="flex" style={{ height: '40px' }}>
        <ImportAccount />
      </Box>
      {accounts.map((account, i) => (
        <Fragment key={i}>
          <Box marginHorizontal="-8px">
            <Separator />
          </Box>
          <AccountRow account={account} />
        </Fragment>
      ))}
    </>
  )
}

function AccountRow({ account }: { account: Account }) {
  const { account: activeAccount, removeAccount } = useAccountStore()
  const { mutateAsync: setAccount } = useSetAccount()

  const active = activeAccount?.address === account.address
  return (
    <Box
      backgroundColor={active ? 'surface/fill/tertiary' : undefined}
      marginHorizontal="-8px"
      paddingHorizontal="8px"
      paddingVertical="12px"
      position="relative"
      style={{ height: '100px' }}
    >
      {active && (
        <Text
          color="text/tertiary"
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
      {account.state === 'loading' && (
        <Box position="absolute" style={{ top: '4px', right: '8px' }}>
          <Spinner size="12px" />
        </Box>
      )}
      <Stack gap="16px">
        <LabelledContent label="Account">
          <Box width="fit" position="relative">
            <Inline gap="4px">
              {account.state === 'loading' && (
                <Text color="text/tertiary" size="12px">
                  {truncate(account.key, { start: 20, end: 20 })}
                </Text>
              )}
              {account.displayName && (
                <Text size="12px">{account.displayName}</Text>
              )}
              <Tooltip label={account.address}>
                <Text
                  color={account.displayName ? 'text/tertiary' : undefined}
                  size="12px"
                >
                  {account.displayName
                    ? truncate(account.address)
                    : account.address}
                </Text>
              </Tooltip>
              {account.address && (
                <Box position="absolute" style={{ right: -24, top: -6 }}>
                  <Button.Copy
                    height="20px"
                    text={account.address!}
                    variant="ghost primary"
                  />
                </Box>
              )}
            </Inline>
          </Box>
        </LabelledContent>
        <Inline gap="4px">
          <Box style={{ width: '100px' }}>
            <Balance address={account.address} />
          </Box>
          <Box style={{ width: '50px' }}>
            <Nonce address={account.address} />
          </Box>
        </Inline>
      </Stack>
      {account.state === 'loaded' && (
        <Box position="absolute" style={{ bottom: '12px', right: '12px' }}>
          <Inline gap="4px" wrap={false}>
            {account.impersonate && (
              <Button.Symbol
                label="Remove"
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
                label="Switch Account"
                height="24px"
                onClick={() => setAccount({ account, setActive: true })}
                symbol="arrow.left.arrow.right"
                variant={active ? 'solid invert' : 'stroked fill'}
              />
            )}
            <Link to={`account/${account.address}`}>
              <Box style={{ width: active ? '52px' : '24px' }}>
                <Button.Symbol
                  label="Account Details"
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
      )}
    </Box>
  )
}

function ImportAccount() {
  const {
    network: { rpcUrl },
  } = useNetworkStore()
  const client = useClient()
  const { mutateAsync: setAccount } = useSetAccount()
  const { accounts, upsertAccount, removeAccount } = useAccountStore()

  const { handleSubmit, register, reset } = useForm<{ addressOrEns: string }>({
    defaultValues: {
      addressOrEns: '',
    },
  })

  const submit = handleSubmit(async ({ addressOrEns }) => {
    reset()

    const isAlreadyImported = accounts.some(
      (account) =>
        account.displayName === addressOrEns ||
        account.address.toLowerCase() === addressOrEns.toLowerCase(),
    )
    if (isAlreadyImported) {
      toast(`"${addressOrEns}" is already imported.`)
      return
    }

    const isDomain_ = isDomain(addressOrEns)
    const isAddress_ = isAddress(addressOrEns)

    const loadingAccount = {
      address: '' as Address,
      key: addressOrEns,
      rpcUrl,
      state: 'loading',
      type: 'json-rpc',
    } as const

    try {
      if (!isDomain_ && !isAddress_) throw new Error()

      if (isDomain_)
        upsertAccount({
          account: loadingAccount,
        })

      const address = isAddress_
        ? addressOrEns
        : await client.getEnsAddress({ name: addressOrEns })
      const displayName = isDomain_ ? addressOrEns : undefined

      if (!address) throw new Error()

      setAccount({
        account: {
          address,
          displayName,
          impersonate: true,
          rpcUrl,
          type: 'json-rpc',
        },
        key: addressOrEns,
      })
    } catch {
      if (isDomain_) removeAccount({ account: loadingAccount })
      toast.error(`"${addressOrEns}" is not a valid address or ENS.`)
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
          register={register('addressOrEns', { required: true })}
        />
        <Button height="24px" variant="stroked fill" width="fit" type="submit">
          Import
        </Button>
      </Inline>
    </Form.Root>
  )
}

function Balance({ address }: { address?: Address }) {
  const { data: balance, isSuccess } = useBalance({ address })
  const { mutate } = useSetBalance()

  const [value, setValue] = useState(balance ? formatEther(balance) : '0')
  useEffect(() => {
    if (balance) setValue(formatEther(balance))
  }, [balance])

  const disabled = !isSuccess || !address

  return (
    <LabelledContent label="Balance (ETH)">
      <Bleed top="-2px">
        <Input
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onBlur={(e) =>
            address
              ? mutate({
                  address,
                  value: parseEther(e.target.value as `${number}`),
                })
              : undefined
          }
          height="24px"
          value={disabled ? '' : value}
        />
      </Bleed>
    </LabelledContent>
  )
}

function Nonce({ address }: { address?: Address }) {
  const { data: nonce, isSuccess } = useNonce({ address })
  const { mutate } = useSetNonce()

  const [value, setValue] = useState(nonce?.toString() ?? '0')
  useEffect(() => {
    if (nonce) setValue(nonce?.toString() ?? '0')
  }, [nonce])

  const disabled = !isSuccess || !address

  return (
    <LabelledContent label="Nonce">
      <Bleed top="-2px">
        <Input
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          value={disabled ? '' : value}
          onBlur={(e) =>
            address
              ? mutate({
                  address,
                  nonce: Number(e.target.value),
                })
              : undefined
          }
          height="24px"
        />
      </Bleed>
    </LabelledContent>
  )
}

////////////////////////////////////////////////////////////////////////
// Blocks

function Blocks() {
  const { data: pendingBlock } = usePendingBlock()

  const query = useInfiniteBlocks()
  const { data: infiniteBlocks } = query

  const blocks = [
    { block: pendingBlock, status: 'pending' },
    ...(infiniteBlocks?.pages
      .flat()
      ?.map((block) => ({ block, status: 'mined' })) || []),
  ]

  const VirtualList = useVirtualList({
    layout: useMemo(
      () => [
        { size: 24, sticky: true, type: 'header' },
        ...blocks.map(
          (_, index) =>
            ({
              index,
              size: 32,
              type: 'item',
            }) as const,
        ),
        { size: 40, type: 'load-more' },
      ],
      [blocks],
    ),
  })

  return (
    <VirtualList.Wrapper marginHorizontal="-8px">
      <VirtualList>
        {({ getLayoutItem, items }) =>
          items.map((item) => {
            const layoutItem = getLayoutItem(item.index)

            if (layoutItem.type === 'header')
              return (
                <VirtualList.Item {...item}>
                  <Box
                    display="flex"
                    alignItems="center"
                    height="full"
                    paddingHorizontal="8px"
                    width="full"
                  >
                    <Columns alignHorizontal="justify" gap="4px" width="full">
                      <Column width="1/4" alignVertical="center">
                        <Text color="text/tertiary" size="9px" wrap={false}>
                          BLOCK
                        </Text>
                      </Column>
                      <Column alignVertical="center">
                        <Text color="text/tertiary" size="9px" wrap={false}>
                          TIMESTAMP
                        </Text>
                      </Column>
                      <Column width="1/5" alignVertical="center">
                        <Text
                          color="text/tertiary"
                          size="9px"
                          overflow
                          wrap={false}
                          style={{ overflow: 'visible' }}
                        >
                          TRANSACTIONS
                        </Text>
                      </Column>
                      <Column width="content">
                        <Box style={{ width: '20px' }} />
                      </Column>
                    </Columns>
                  </Box>
                  <Separator />
                </VirtualList.Item>
              )

            if (layoutItem.type === 'load-more')
              return (
                <VirtualList.Item {...item}>
                  <LoadMore query={query}>
                    <Inset space="8px">
                      <Text color="text/tertiary">Loading...</Text>
                    </Inset>
                  </LoadMore>
                </VirtualList.Item>
              )

            const { block, status } = blocks[layoutItem.index ?? 0] || {}
            if (!block) return
            return (
              <VirtualList.Item {...item}>
                <VirtualList.Link to={`block/${block.number}?status=${status}`}>
                  <Box marginHorizontal="-8px">
                    <Separator />
                  </Box>
                  <Box
                    backgroundColor={{ hover: 'surface/fill/quarternary' }}
                    paddingHorizontal="8px"
                    height="full"
                  >
                    <Columns alignHorizontal="justify" gap="4px" width="full">
                      <Column width="1/4" alignVertical="center">
                        <Text size="12px">{block.number!.toString()}</Text>
                      </Column>
                      <Column alignVertical="center">
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
                      </Column>
                      <Column width="1/5" alignVertical="center">
                        <Text size="12px">
                          {block.transactions.length || '0'}
                        </Text>
                      </Column>
                      <Column alignVertical="center" width="content">
                        <Box style={{ width: '20px' }}>
                          {status !== 'pending' && (
                            <RevertButton block={block} />
                          )}
                        </Box>
                      </Column>
                    </Columns>
                  </Box>
                </VirtualList.Link>
              </VirtualList.Item>
            )
          })
        }
      </VirtualList>
    </VirtualList.Wrapper>
  )
}

function RevertButton({ block }: { block?: Block }) {
  const { data: snapshot } = useSnapshot({
    blockNumber: block?.number,
    enabled: false,
  })
  const { mutateAsync: revert } = useRevert()

  if (!snapshot || !block?.timestamp) return null
  return (
    <Button.Symbol
      label="Revert Block"
      height="20px"
      onClick={(e) => {
        e.preventDefault()
        revert({ id: snapshot! })
      }}
      symbol="arrow.counterclockwise"
      variant="ghost primary"
    />
  )
}

////////////////////////////////////////////////////////////////////////
// Transactions

const numberIntl4SigFigs = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 4,
})

function Transactions() {
  const { data: pendingTransactions } = usePendingTransactions()

  const query = useInfiniteBlockTransactions()
  const { data: infiniteBlockTransactions, isFetched } = query

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

  const [searchText, setSearchText] = useSearchParamsState('searchText', '')
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
    const filteredTransactions = blockTransactions.filter(({ transaction }) => {
      const to = (transaction.to || '').toLowerCase()
      const from = transaction.from.toLowerCase()
      const hash = transaction.hash.toLowerCase()
      const searchText = debouncedSearchText.toLowerCase()

      return (
        to.includes(searchText) ||
        from.includes(searchText) ||
        hash.includes(searchText)
      )
    })
    return filteredTransactions
  }, [blockTransactions, debouncedSearchText, transaction])

  const isEmpty = isFetched && transactions.length === 0

  const VirtualList = useVirtualList({
    layout: useMemo(
      () => [
        { size: 40, sticky: Boolean(debouncedSearchText), type: 'search' },
        { size: 24, sticky: true, type: 'header' },
        isLoading ? { size: 40, type: 'loading' } : undefined,
        isEmpty ? { size: 40, type: 'empty' } : undefined,
        ...transactions.map(
          (_, index) =>
            ({
              index,
              size: 32,
              type: 'item',
            }) as const,
        ),
        !debouncedSearchText ? { size: 40, type: 'load-more' } : undefined,
      ],
      [isLoading, isEmpty, transactions, debouncedSearchText],
    ),
  })

  // Preserve input focus when searching.
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (debouncedSearchText) inputRef.current?.focus()
  }, [debouncedSearchText])

  return (
    <VirtualList.Wrapper marginHorizontal="-8px">
      <VirtualList>
        {({ getLayoutItem, items }) =>
          items.map((item) => {
            const layoutItem = getLayoutItem(item.index)

            if (layoutItem.type === 'search')
              return (
                <VirtualList.Item {...item}>
                  <Box
                    display="flex"
                    alignItems="center"
                    height="full"
                    paddingHorizontal="8px"
                  >
                    <Input
                      ref={inputRef}
                      height="24px"
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search by transaction hash or address..."
                      value={searchText}
                    />
                  </Box>
                </VirtualList.Item>
              )

            if (layoutItem.type === 'header')
              return (
                <VirtualList.Item {...item}>
                  <Box
                    display="flex"
                    alignItems="center"
                    height="full"
                    paddingHorizontal="8px"
                    width="full"
                  >
                    <Columns alignHorizontal="justify" gap="4px" width="full">
                      <Column alignVertical="center">
                        <Text color="text/tertiary" size="9px" wrap={false}>
                          BLOCK
                        </Text>
                      </Column>
                      <Column alignVertical="center">
                        <Text color="text/tertiary" size="9px" wrap={false}>
                          FROM
                        </Text>
                      </Column>
                      <Column alignVertical="center">
                        <Text color="text/tertiary" size="9px" wrap={false}>
                          TO
                        </Text>
                      </Column>
                      <Column alignVertical="center">
                        <Text
                          align="right"
                          color="text/tertiary"
                          size="9px"
                          wrap={false}
                        >
                          VALUE
                        </Text>
                      </Column>
                    </Columns>
                  </Box>
                  <Separator />
                </VirtualList.Item>
              )

            if (layoutItem.type === 'loading')
              return (
                <VirtualList.Item {...item}>
                  <Box
                    display="flex"
                    height="full"
                    padding="8px"
                    paddingVertical="12px"
                  >
                    <Text color="text/secondary" size="14px">
                      Loading...
                    </Text>
                  </Box>
                </VirtualList.Item>
              )

            if (layoutItem.type === 'empty')
              return (
                <VirtualList.Item {...item}>
                  <Box
                    display="flex"
                    height="full"
                    padding="8px"
                    paddingVertical="12px"
                  >
                    {debouncedSearchText ? (
                      <Text color="text/secondary" size="14px">
                        No transactions found by search text "
                        <Text color="text" wrap="anywhere">
                          {debouncedSearchText}
                        </Text>
                        ".
                      </Text>
                    ) : (
                      <Text color="text/secondary" size="14px">
                        No transactions found.
                      </Text>
                    )}
                  </Box>
                </VirtualList.Item>
              )

            if (layoutItem.type === 'load-more')
              return (
                <VirtualList.Item {...item}>
                  <LoadMore query={query}>
                    <Inset space="8px">
                      <Text color="text/tertiary">Loading...</Text>
                    </Inset>
                  </LoadMore>
                </VirtualList.Item>
              )

            const { transaction, status } =
              transactions[layoutItem.index ?? 0] || {}
            if (!transaction || typeof transaction === 'string') return
            return (
              <VirtualList.Item {...item}>
                <VirtualList.Link to={`/transaction/${transaction.hash}`}>
                  <Box marginHorizontal="-8px">
                    <Separator />
                  </Box>
                  <Box
                    backgroundColor={{ hover: 'surface/fill/quarternary' }}
                    paddingHorizontal="8px"
                    paddingVertical="8px"
                    height="full"
                  >
                    <Columns gap="6px" alignVertical="center">
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
                      <Column alignVertical="center">
                        <Tooltip side="bottom" label={transaction.from}>
                          <Text.Truncated size="12px">
                            {transaction.from}
                          </Text.Truncated>
                        </Tooltip>
                      </Column>
                      <Column alignVertical="center">
                        {transaction.to ? (
                          <Tooltip side="bottom" label={transaction.to}>
                            <Text.Truncated size="12px">
                              {transaction.to}
                            </Text.Truncated>
                          </Tooltip>
                        ) : (
                          <Text color="text/tertiary" size="11px" wrap={false}>
                            Deploy Contract
                          </Text>
                        )}
                      </Column>
                      <Column alignVertical="center">
                        <Text
                          align="right"
                          wrap={false}
                          size="12px"
                          width="full"
                        >
                          {numberIntl4SigFigs.format(
                            Number(formatEther(transaction.value!)),
                          )}{' '}
                          <Text color="text/tertiary">ETH</Text>
                        </Text>
                      </Column>
                    </Columns>
                  </Box>
                </VirtualList.Link>
              </VirtualList.Item>
            )
          })
        }
      </VirtualList>
    </VirtualList.Wrapper>
  )
}

////////////////////////////////////////////////////////////////////////
// Contracts

function Contracts() {
  const { contracts: contracts_, hideContract } = useContracts()

  const contracts = contracts_.filter((contract) => contract.visible)

  const VirtualList = useVirtualList({
    layout: useMemo(
      () => [
        { size: 40, sticky: true, type: 'search' },
        { size: 24, sticky: true, type: 'header' },
        ...contracts.map(
          (_, index) =>
            ({
              index,
              size: 40,
              type: 'item',
            }) as const,
        ),
      ],
      [contracts],
    ),
  })

  return (
    <VirtualList.Wrapper marginHorizontal="-8px">
      <VirtualList>
        {({ getLayoutItem, items }) =>
          items.map((item) => {
            const layoutItem = getLayoutItem(item.index)

            if (layoutItem.type === 'search')
              return (
                <VirtualList.Item {...item}>
                  <Inset space="8px">
                    <ImportContract />
                  </Inset>
                </VirtualList.Item>
              )

            if (layoutItem.type === 'header')
              return (
                <VirtualList.Item {...item}>
                  <Box
                    display="flex"
                    alignItems="center"
                    height="full"
                    paddingHorizontal="8px"
                    width="full"
                  >
                    <Columns alignHorizontal="justify" gap="4px" width="full">
                      <Column alignVertical="center">
                        <Text color="text/tertiary" size="9px" wrap={false}>
                          ADDRESS
                        </Text>
                      </Column>
                    </Columns>
                  </Box>
                  <Separator />
                </VirtualList.Item>
              )

            if (layoutItem.type === 'loading')
              return (
                <VirtualList.Item {...item}>
                  <Box
                    display="flex"
                    height="full"
                    padding="8px"
                    paddingVertical="12px"
                  >
                    <Text color="text/secondary" size="14px">
                      Loading...
                    </Text>
                  </Box>
                </VirtualList.Item>
              )

            const contract = contracts[layoutItem.index ?? 0] || {}
            if (!contract) return
            return (
              <VirtualList.Item {...item}>
                <Box marginHorizontal="-8px">
                  <Separator />
                </Box>
                <VirtualList.Link to={`/contract/${contract.address}`}>
                  <Box
                    backgroundColor={{ hover: 'surface/fill/quarternary' }}
                    paddingHorizontal="8px"
                    paddingVertical="8px"
                    style={{ minHeight: '40px' }}
                  >
                    <Columns
                      alignHorizontal="justify"
                      gap="4px"
                      alignVertical="center"
                      width="full"
                    >
                      <Column alignVertical="center">
                        <Stack gap="8px">
                          {contract.address !== '0x' ? (
                            <>
                              <Text size="11px" wrap={false}>
                                {contract.name || 'Unnamed Contract'}
                              </Text>
                              <Text
                                color="text/secondary"
                                size="9px"
                                wrap={false}
                              >
                                {contract.address}
                              </Text>
                            </>
                          ) : (
                            <Text
                              color="text/tertiary"
                              size="11px"
                              wrap={false}
                            >
                              Deploying...
                            </Text>
                          )}
                        </Stack>
                      </Column>
                      <Column alignVertical="center" width="content">
                        <Button.Symbol
                          label="Delete"
                          symbol="trash"
                          height="24px"
                          variant="ghost red"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            hideContract({
                              address: contract.address,
                            })
                          }}
                        />
                      </Column>
                    </Columns>
                  </Box>
                </VirtualList.Link>
              </VirtualList.Item>
            )
          })
        }
      </VirtualList>
    </VirtualList.Wrapper>
  )
}

function ImportContract() {
  const { account } = useAccountStore()
  const client = useClient()
  const { addContract, contracts, updateContract, removeContract } =
    useContracts()

  const { formState, handleSubmit, register, reset, watch } = useForm<{
    addressOrBytecode: string
  }>({
    defaultValues: {
      addressOrBytecode: '',
    },
    mode: 'onChange',
  })

  const submit = handleSubmit(async ({ addressOrBytecode }) => {
    reset()

    const isAlreadyImported = contracts?.some(
      (contract) =>
        contract.visible &&
        contract.address.toLowerCase() === addressOrBytecode.toLowerCase(),
    )
    if (isAlreadyImported) {
      toast(`"${addressOrBytecode}" is already imported.`)
      return
    }

    const address = isAddress(addressOrBytecode) ? addressOrBytecode : undefined
    const bytecode = isAddress(addressOrBytecode)
      ? undefined
      : (addressOrBytecode as Hex)
    const key = `${address}-${bytecode}`

    try {
      addContract({
        address: address ?? '0x',
        bytecode,
        key,
        state: 'loading',
      })

      // Add contract address.
      if (address) {
        const bytecode_ = await client.getBytecode({ address })
        if (!bytecode_) throw new Error()

        updateContract({
          address,
          bytecode: bytecode_,
          key,
          state: 'loaded',
        })
        return
      }

      // Deploy contract bytecode.
      if (bytecode) {
        if (!account?.address) throw new Error()

        await client.deployContract({
          abi: [],
          bytecode,
          account: account.address,
          chain: null,
        })

        return
      }
    } catch {
      removeContract({ key })
      toast.error(
        `"${addressOrBytecode}" is not a valid contract address or bytecode.`,
      )
    }
  })

  const watchAddressOrBytecode = watch('addressOrBytecode')
  const submitText = useMemo(() => {
    if (!formState.isDirty) return 'Import'
    if (formState.errors.addressOrBytecode) return 'Import'
    if (isAddress(watchAddressOrBytecode)) return 'Import'
    return 'Deploy'
  }, [
    formState.errors.addressOrBytecode,
    formState.isDirty,
    watchAddressOrBytecode,
  ])

  return (
    <Form.Root onSubmit={submit} style={{ width: '100%' }}>
      <Inline gap="4px" wrap={false}>
        <Form.InputField
          height="24px"
          hideLabel
          label="Import address"
          placeholder="Import contract address or deploy bytecode..."
          register={register('addressOrBytecode', {
            pattern: /^0x[a-fA-F0-9]+$/,
            required: true,
          })}
        />
        {formState.isDirty && (
          <Button
            disabled={!formState.isValid}
            height="24px"
            variant="stroked fill"
            width="fit"
            type="submit"
          >
            {submitText}
          </Button>
        )}
      </Inline>
    </Form.Root>
  )
}
