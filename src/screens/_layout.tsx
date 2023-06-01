import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Link, Outlet } from 'react-router-dom'

import {
  Bleed,
  Box,
  Column,
  Columns,
  Inline,
  Inset,
  Row,
  Rows,
  SFSymbol,
  Stack,
  Text,
} from '~/design-system'
import { useNetworkStatus, useWalletClient } from '~/hooks'
import { useNetwork, usePendingRequests } from '~/zustand'

import PendingRequest from './pending-request'

export default function Layout() {
  const { pendingRequests } = usePendingRequests()
  const pendingRequest = pendingRequests[pendingRequests.length - 1]

  return (
    <Box
      backgroundColor='surface'
      borderWidth='1.5px'
      display='flex'
      style={{
        height: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Rows>
        <Row height='content'>
          <Header />
        </Row>
        <Row>
          <Box style={{ overflowY: 'scroll' }} width='full'>
            {pendingRequests.length > 0 ? (
              <PendingRequest request={pendingRequest} />
            ) : (
              <Outlet />
            )}
          </Box>
        </Row>
      </Rows>
    </Box>
  )
}

function Header() {
  const walletClient = useWalletClient()
  const { network } = useNetwork()

  const { data: listening, status } = useNetworkStatus()

  const { data: addresses } = useQuery({
    enabled: Boolean(listening),
    queryKey: ['addresses', walletClient.key],
    queryFn: walletClient.getAddresses,
  })

  // TODO: retrieve selected account from global sync state (zustand).
  const _address = addresses?.[0]

  return (
    <Box
      borderColor='primary / 0.1'
      borderBottomWidth='1px'
      width='full'
      style={{ height: '48px' }}
    >
      <Columns alignVertical='center'>
        <Column alignVertical='center' width='content'>
          <Inset left='12px' right='8px'>
            <Box style={{ width: '52px' }}>
              <HeaderItem label='Status'>
                <Inline alignVertical='center' gap='4px' wrap={false}>
                  <Box
                    backgroundColor={
                      status === 'pending'
                        ? 'primary / 0.5'
                        : listening
                        ? 'green'
                        : 'red'
                    }
                    borderWidth='1px'
                    borderRadius='round'
                    style={{ width: 8, height: 8 }}
                  />
                  <Text size='12px'>
                    {status === 'pending'
                      ? ''
                      : listening
                      ? 'Online'
                      : 'Offline'}
                  </Text>
                </Inline>
              </HeaderItem>
            </Box>
          </Inset>
        </Column>
        <Column width='content'>
          <Box
            backgroundColor='primary / 0.1'
            height='full'
            style={{ width: '1px' }}
          />
        </Column>
        <Column alignVertical='center'>
          <Link to='network-config' style={{ height: '100%' }}>
            <Box
              backgroundColor={{
                hover: 'primary / 0.02',
              }}
              height='full'
              paddingLeft='12px'
              style={{ cursor: 'default' }}
            >
              <Columns>
                <Column>
                  <Columns gap='8px'>
                    <Column alignVertical='center' width='1/2'>
                      <HeaderItem label='RPC URL'>
                        <Inline alignVertical='center' gap='8px' wrap={false}>
                          <Text size='12px' wrap={false} width='full'>
                            {network.rpcUrl.replace(/https?:\/\//, '')}
                          </Text>
                        </Inline>
                      </HeaderItem>
                    </Column>
                    <Column alignVertical='center' width='1/2'>
                      <HeaderItem label='Chain'>
                        <Inline alignVertical='center' gap='8px' wrap={false}>
                          <Text size='12px' wrap={false} width='full'>
                            {network.chainId}: {network.name}
                          </Text>
                        </Inline>
                      </HeaderItem>
                    </Column>
                  </Columns>
                </Column>
                <Column alignVertical='center' width='content'>
                  <Inset right='12px'>
                    <SFSymbol
                      color='label'
                      size='12px'
                      symbol='chevron.down'
                      weight='medium'
                    />
                  </Inset>
                </Column>
              </Columns>
            </Box>
          </Link>
        </Column>
      </Columns>
    </Box>
  )
}

function HeaderItem({
  children,
  label,
}: { children: ReactNode; label: string }) {
  return (
    <Bleed top='-4px'>
      <Stack gap='8px'>
        <Text color='label' size='9px'>
          {label.toUpperCase()}
        </Text>
        <Box>{children}</Box>
      </Stack>
    </Bleed>
  )
}
