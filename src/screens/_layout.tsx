import { type ReactNode, useCallback } from 'react'
import { Link, Outlet } from 'react-router-dom'

import {
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
import { useHost, useNetworkStatus } from '~/hooks'
import {
  useAccount,
  useNetwork,
  usePendingRequests,
  useSessions,
} from '~/zustand'

import { BrandIcon } from '../components/icons/BrandIcon'
import { getMessenger } from '../messengers'
import PendingRequest from './pending-request'

const contentMessenger = getMessenger({ connection: 'wallet <> contentScript' })

function truncateAddress(address: string) {
  return `${address.slice(0, 8)}\u2026${address.slice(-6)}`
}

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
  const { account } = useAccount()
  const { network } = useNetwork()

  const { data: host } = useHost()
  const { data: listening, status } = useNetworkStatus()
  const { sessions } = useSessions()

  const isConnected = Boolean(host && sessions[host])

  const handleClose = useCallback(() => {
    contentMessenger.send('toggleWallet', undefined)
  }, [])

  return (
    <Box style={{ height: '80px' }} width='full'>
      <Rows>
        <Row>
          <Box borderColor='primary / 0.1' borderBottomWidth='1px' width='full'>
            <Columns>
              <Column width='content'>
                <Link to='/' style={{ height: '100%' }}>
                  <Box
                    alignItems='center'
                    backgroundColor={{
                      hover: 'primary / 0.05',
                    }}
                    display='flex'
                    justifyContent='center'
                    height='full'
                    style={{ width: '36px' }}
                  >
                    <BrandIcon size='22px' />
                  </Box>
                </Link>
              </Column>
              <Column width='content'>
                <Box
                  backgroundColor='primary / 0.1'
                  height='full'
                  style={{ width: '1px' }}
                />
              </Column>
              <Column>
                {account && (
                  <Link to='accounts' style={{ height: '100%' }}>
                    <Box
                      alignItems='center'
                      backgroundColor={{
                        hover: 'primary / 0.05',
                      }}
                      display='flex'
                      height='full'
                      style={{ cursor: 'default' }}
                    >
                      <Inset horizontal='12px'>
                        {account && (
                          <HeaderItem label='Account'>
                            <Text size='11px'>
                              {truncateAddress(account.address)}
                            </Text>
                          </HeaderItem>
                        )}
                      </Inset>
                    </Box>
                  </Link>
                )}
              </Column>
              <Column width='content'>
                <Box
                  backgroundColor='primary / 0.1'
                  height='full'
                  style={{ width: '1px' }}
                />
              </Column>
              <Column>
                <Link to='session' style={{ height: '100%' }}>
                  <Box
                    alignItems='center'
                    backgroundColor={{
                      hover: 'primary / 0.05',
                    }}
                    display='flex'
                    height='full'
                    style={{ cursor: 'default' }}
                  >
                    <Inset horizontal='12px'>
                      <HeaderItem label={host?.replace('www.', '') || ''}>
                        <Inline alignVertical='center' gap='4px' wrap={false}>
                          <Text
                            size='12px'
                            style={{ opacity: isConnected ? 1 : 0.5 }}
                          >
                            {isConnected ? 'Connected' : 'Disconnected'}
                          </Text>
                        </Inline>
                      </HeaderItem>
                    </Inset>
                  </Box>
                </Link>
              </Column>
              <Column width='content'>
                <Box
                  backgroundColor='primary / 0.1'
                  height='full'
                  style={{ width: '1px' }}
                />
              </Column>
              <Column width='content'>
                <Box
                  alignItems='center'
                  as='button'
                  backgroundColor={{
                    hover: 'primary / 0.05',
                  }}
                  display='flex'
                  justifyContent='center'
                  height='full'
                  onClick={handleClose}
                  style={{ width: '28px' }}
                >
                  <SFSymbol
                    size='12px'
                    symbol='chevron.right.2'
                    weight='medium'
                  />
                </Box>
              </Column>
            </Columns>
          </Box>
        </Row>
        <Row>
          <Box borderColor='primary / 0.1' borderBottomWidth='1px' width='full'>
            <Columns alignVertical='center'>
              <Column alignVertical='center' width='content'>
                <Inset left='12px' right='8px'>
                  <Box style={{ width: '52px' }}>
                    <HeaderItem label='Network'>
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
                <Link to='network' style={{ height: '100%' }}>
                  <Box
                    backgroundColor={{
                      hover: 'primary / 0.05',
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
                              <Text size='12px' wrap={false} width='full'>
                                {network.rpcUrl.replace(/https?:\/\//, '')}
                              </Text>
                            </HeaderItem>
                          </Column>
                          <Column alignVertical='center' width='1/2'>
                            <HeaderItem label='Chain'>
                              <Text size='12px' wrap={false} width='full'>
                                {network.chainId}: {network.name}
                              </Text>
                            </HeaderItem>
                          </Column>
                        </Columns>
                      </Column>
                    </Columns>
                  </Box>
                </Link>
              </Column>
            </Columns>
          </Box>
        </Row>
      </Rows>
    </Box>
  )
}

function HeaderItem({
  children,
  label,
}: { children: ReactNode; label: string }) {
  return (
    <Stack gap='8px'>
      <Text color='label' size='9px' wrap={false}>
        {label.toUpperCase()}
      </Text>
      <Box>{children}</Box>
    </Stack>
  )
}
