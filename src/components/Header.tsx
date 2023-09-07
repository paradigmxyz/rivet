import { type ReactNode, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatGwei } from 'viem'

import { Tooltip } from '~/components'
import { BrandIcon } from '~/components/svgs'
import {
  Box,
  Column,
  Columns,
  Inline,
  Inset,
  Row,
  Rows,
  SFSymbol,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useGetAutomine } from '~/hooks/useGetAutomine'
import { useHost } from '~/hooks/useHost'
import { useMine } from '~/hooks/useMine'
import { useNetworkStatus } from '~/hooks/useNetworkStatus'
import { usePendingBlock } from '~/hooks/usePendingBlock'
import { getMessenger } from '~/messengers'
import { truncate } from '~/utils'
import { useAccountStore, useNetworkStore, useSessionsStore } from '~/zustand'

import * as styles from './Header.css'

const contentMessenger = getMessenger('wallet:contentScript')

export function Header({ isNetworkOffline }: { isNetworkOffline?: boolean }) {
  return (
    <Rows>
      <Row>
        <Columns width="full">
          <Column width="content">
            <HomeButton />
          </Column>
          <Column width="content">
            <Separator orientation="vertical" />
          </Column>
          <Column>
            <Account />
          </Column>
          <Column width="content">
            <Separator orientation="vertical" />
          </Column>
          <Column>
            <DappConnection />
          </Column>
          <Column width="content">
            <Separator orientation="vertical" />
          </Column>
          <Column width="content">
            <CollapseButton />
          </Column>
        </Columns>
      </Row>
      <Row height="content">
        <Separator />
      </Row>
      <Row>
        <Network />
      </Row>
      <Row height="content">
        <Separator />
      </Row>
      <Row>
        <Box position="relative" width="full">
          <Block />
          {isNetworkOffline && <NetworkOfflineOverlay />}
        </Box>
      </Row>
      <Row height="content">
        <Box position="relative" width="full">
          <Separator />
          {isNetworkOffline && <NetworkOfflineOverlay />}
        </Box>
      </Row>
    </Rows>
  )
}

function HeaderItem({
  children,
  label,
}: { children: ReactNode; label: string }) {
  return (
    <Stack gap="8px">
      <Text color="text/tertiary" size="9px" wrap={false}>
        {label.toUpperCase()}
      </Text>
      <Box>{children}</Box>
    </Stack>
  )
}

function NetworkOfflineOverlay() {
  return (
    <Box
      backgroundColor="surface/black@0.5"
      position="absolute"
      height="full"
      top="0px"
      width="full"
    />
  )
}

////////////////////////////////////////////////////////////////////////
// Top Bar

function HomeButton() {
  return (
    <Link to="/" style={{ height: '100%' }}>
      <Box
        alignItems="center"
        backgroundColor={{
          hover: 'surface/fill/quarternary',
        }}
        display="flex"
        justifyContent="center"
        height="full"
        style={{ width: '36px' }}
      >
        <BrandIcon size="22px" />
      </Box>
    </Link>
  )
}

function Account() {
  const { account } = useAccountStore()
  if (!account) return null
  return (
    <Link to="account-config" style={{ height: '100%' }}>
      <Box
        alignItems="center"
        backgroundColor={{
          hover: 'surface/fill/quarternary',
        }}
        display="flex"
        height="full"
        style={{ cursor: 'default' }}
      >
        <Inset horizontal="8px">
          {account && (
            <HeaderItem label="Account">
              <Tooltip label={account.address}>
                <Text size="11px">{truncate(account.address)}</Text>
              </Tooltip>
            </HeaderItem>
          )}
        </Inset>
      </Box>
    </Link>
  )
}

function DappConnection() {
  const { data: host } = useHost()
  const { getSession } = useSessionsStore()
  const isConnected = Boolean(host && getSession({ host }))

  return (
    <Link to="session" style={{ height: '100%' }}>
      <Box
        alignItems="center"
        backgroundColor={{
          hover: 'surface/fill/quarternary',
        }}
        display="flex"
        height="full"
        style={{ cursor: 'default' }}
      >
        <Inset horizontal="8px">
          <HeaderItem label={host?.replace('www.', '') || ''}>
            <Inline alignVertical="center" gap="4px" wrap={false}>
              <Text size="12px" style={{ opacity: isConnected ? 1 : 0.5 }}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </Inline>
          </HeaderItem>
        </Inset>
      </Box>
    </Link>
  )
}

function CollapseButton() {
  const handleClose = useCallback(() => {
    contentMessenger.send('toggleWallet', undefined)
  }, [])

  return (
    <Box
      alignItems="center"
      as="button"
      backgroundColor={{
        hover: 'surface/fill/quarternary',
      }}
      display="flex"
      justifyContent="center"
      height="full"
      onClick={handleClose}
      style={{ width: '28px' }}
    >
      <SFSymbol size="12px" symbol="chevron.right.2" weight="medium" />
    </Box>
  )
}

////////////////////////////////////////////////////////////////////////
// Middle Bar

function Network() {
  return (
    <Link to="network-config" style={{ height: '100%', width: '100%' }}>
      <Box
        alignItems="center"
        backgroundColor={{
          hover: 'surface/fill/quarternary',
        }}
        display="flex"
        height="full"
        width="full"
        style={{ cursor: 'default' }}
      >
        <Inset horizontal="8px">
          <Columns gap="12px">
            <Column alignVertical="center" width="1/2">
              <RpcUrl />
            </Column>
            <Column alignVertical="center" width="1/2">
              <Inset left="8px">
                <Chain />
              </Inset>
            </Column>
          </Columns>
        </Inset>
      </Box>
    </Link>
  )
}

function RpcUrl() {
  const { network } = useNetworkStore()
  const { data: listening, status } = useNetworkStatus()

  return (
    <HeaderItem label="RPC URL">
      <Inline gap="4px" wrap={false}>
        <Box
          backgroundColor={
            status === 'pending'
              ? 'surface/invert@0.5'
              : listening
              ? 'surface/green'
              : 'surface/red'
          }
          borderWidth="1px"
          borderRadius="round"
          style={{ minWidth: 8, minHeight: 8 }}
        />
        <Text size="12px" wrap={false} width="full">
          {network.rpcUrl.replace(/https?:\/\//, '')}
        </Text>
      </Inline>
    </HeaderItem>
  )
}

function Chain() {
  const { network } = useNetworkStore()

  return (
    <HeaderItem label="Chain">
      <Text size="12px" wrap={false} width="full">
        {network.chainId}: {network.name}
      </Text>
    </HeaderItem>
  )
}

////////////////////////////////////////////////////////////////////////
// Lower Bar

function Block() {
  return (
    <Link to="block-config" style={{ width: '100%' }}>
      <Box
        alignItems="center"
        backgroundColor={{
          hover: 'surface/fill/quarternary',
        }}
        display="flex"
        height="full"
        width="full"
        style={{ cursor: 'default' }}
      >
        <Columns width="full">
          <Column alignVertical="center">
            <Inset horizontal="8px">
              <BlockNumber />
            </Inset>
          </Column>
          <Column alignVertical="center">
            <Inset horizontal="8px">
              <MiningStatus />
            </Inset>
          </Column>
          <Column alignVertical="center">
            <Inset horizontal="8px">
              <BaseFee />
            </Inset>
          </Column>
        </Columns>
      </Box>
    </Link>
  )
}

function BlockNumber() {
  const { data: block } = usePendingBlock()
  return (
    <Box position="relative">
      <Inline wrap={false}>
        <HeaderItem label="Block">
          <Text size="12px" tabular>
            {block?.number ? block?.number.toString() : ''}
          </Text>
        </HeaderItem>
        {block && (
          <Inset horizontal="2px">
            <MineButton />
          </Inset>
        )}
      </Inline>
    </Box>
  )
}

function MiningStatus() {
  const { data: block } = usePendingBlock()
  const { data: automining } = useGetAutomine()
  const { network } = useNetworkStore()
  return (
    <HeaderItem label="Mining Status">
      <Text size="12px">
        {block
          ? automining
            ? 'Automine'
            : network.blockTime
            ? `Interval: ${network.blockTime}s`
            : 'On Demand'
          : ''}
      </Text>
    </HeaderItem>
  )
}

function BaseFee() {
  const { data: block } = usePendingBlock()
  const intl = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        maximumSignificantDigits: 6,
      }),
    [],
  )
  if (!block) return null
  return (
    <HeaderItem label="Base Fee">
      <Text size="12px">
        {intl.format(Number(formatGwei(block.baseFeePerGas!)))}{' '}
        <Text color="text/tertiary">gwei</Text>
      </Text>
    </HeaderItem>
  )
}

function MineButton() {
  const { data: block } = usePendingBlock()
  const { mutateAsync: mine } = useMine()

  return (
    // TODO: Extract into `IconButton`
    <Box
      key={block?.number?.toString()}
      as="button"
      backgroundColor={{
        hover: 'surface/fill/secondary',
      }}
      borderRadius="3px"
      onClick={(e) => {
        e.preventDefault()
        mine({ blocks: 1 })
      }}
      position="absolute"
      style={{ marginTop: '8px', width: '20px', height: '20px' }}
      transform={{ hoveractive: 'shrink95' }}
    >
      <SFSymbol
        className={styles.mineSymbol}
        color="text/tertiary"
        symbol="hammer.fill"
        size="12px"
      />
    </Box>
  )
}
