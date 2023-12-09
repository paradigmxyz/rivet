import { type ReactNode, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { type Hex, formatGwei } from 'viem'

import { Tooltip } from '~/components'
import { BrandIcon } from '~/components/svgs'
import { useAppMeta } from '~/contexts'
import {
  Box,
  Button,
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
import { useAccountStore, useNetworkStore, useSessionsStore } from '~/zustand'

import { useRevert } from '../hooks/useRevert'
import { useSnapshot } from '../hooks/useSnapshot'
import * as styles from './Header.css'

const contentMessenger = getMessenger('wallet:contentScript')

export function Header({ isNetworkOffline }: { isNetworkOffline?: boolean }) {
  const { type } = useAppMeta()
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
          <Column style={{ maxWidth: '340px' }}>
            <Account />
          </Column>
          {type === 'embedded' && (
            <>
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
                <SettingsButton />
              </Column>
              <Column width="content">
                <Separator orientation="vertical" />
              </Column>
              <Column width="content">
                <CollapseButton />
              </Column>
            </>
          )}
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
        <Box
          width="full"
          style={
            isNetworkOffline ? { opacity: 0.5, pointerEvents: 'none' } : {}
          }
        >
          <Block />
        </Box>
      </Row>
      <Row height="content">
        <Separator />
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
    <Link to="/" style={{ height: '100%' }}>
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
                <Text.Truncated size="11px">{account.address}</Text.Truncated>
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
  const { sessions } = useSessionsStore()
  const isConnected = Boolean(
    host && sessions.find((session) => session.host === host),
  )

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
    <Tooltip label="Hide Wallet" height="full">
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
    </Tooltip>
  )
}

function SettingsButton() {
  return (
    <Tooltip label="Settings" height="full">
      <Link to="/settings">
        <Box
          alignItems="center"
          as="button"
          backgroundColor={{
            hover: 'surface/fill/quarternary',
          }}
          display="flex"
          justifyContent="center"
          height="full"
          style={{ width: '28px' }}
        >
          <SFSymbol size="14px" symbol="gear" weight="medium" />
        </Box>
      </Link>
    </Tooltip>
  )
}

////////////////////////////////////////////////////////////////////////
// Middle Bar

function Network() {
  return (
    <Link to="networks" style={{ height: '100%', width: '100%' }}>
      <Box
        alignItems="center"
        backgroundColor={{
          hover: 'surface/fill/quarternary',
        }}
        display="flex"
        height="full"
        maxWidth="480px"
        style={{ cursor: 'default' }}
      >
        <Inset horizontal="8px">
          <Columns alignVertical="center" gap="12px">
            <Column alignVertical="center">
              <RpcUrl />
            </Column>
            <Column alignVertical="center">
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
        <Text
          size="12px"
          wrap={false}
          width="full"
          style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
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
        maxWidth="480px"
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
  const { data: snapshot } = useSnapshot({
    blockNumber: block?.number ? block?.number - 1n : undefined,
    enabled: false,
  })
  return (
    <Box position="relative">
      <Inline gap="4px" wrap={false}>
        <Box width="fit">
          <HeaderItem label="Block">
            <Text size="12px" tabular>
              {block?.number ? block?.number.toString() : ''}
            </Text>
          </HeaderItem>
        </Box>
        <Inline wrap={false}>
          {block && <MineButton />}
          <RevertButton snapshot={snapshot} />
        </Inline>
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
    <Box key={block?.number?.toString()} style={{ marginTop: '8px' }}>
      <Button.Symbol
        label="Mine Block"
        height="20px"
        onClick={(e) => {
          e.preventDefault()
          mine({ blocks: 1 })
        }}
        symbol="hammer.fill"
        symbolProps={{ className: styles.mineSymbol }}
        variant="ghost primary"
      />
    </Box>
  )
}

function RevertButton({ snapshot }: { snapshot?: Hex }) {
  const { mutateAsync: revert } = useRevert()

  return (
    <Box key={snapshot} style={{ marginTop: '8px' }}>
      <Button.Symbol
        disabled={!snapshot}
        label="Revert Block"
        height="20px"
        onClick={(e) => {
          e.preventDefault()
          revert({ id: snapshot! })
        }}
        symbol="backward.fill"
        variant="ghost primary"
      />
    </Box>
  )
}
