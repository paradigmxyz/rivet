import { type ReactNode, useCallback } from 'react'
import { Link } from 'react-router-dom'

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
  Stack,
  Text,
} from '~/design-system'
import { useBlockNumber, useHost, useNetworkStatus } from '~/hooks'
import { useAccount, useNetwork, useSessions } from '~/zustand'

import { getMessenger } from '../messengers'

const contentMessenger = getMessenger({ connection: 'wallet <> contentScript' })

function truncateAddress(address: string) {
  return `${address.slice(0, 8)}\u2026${address.slice(-6)}`
}

export function Header() {
  const { account } = useAccount()
  const { network } = useNetwork()

  const { data: blockNumber } = useBlockNumber()
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
          <Box
            borderColor='separator/tertiary'
            borderBottomWidth='1px'
            width='full'
          >
            <Columns>
              <Column width='content'>
                <Link to='/' style={{ height: '100%' }}>
                  <Box
                    alignItems='center'
                    backgroundColor={{
                      hover: 'surface/fill/quarternary',
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
                  backgroundColor='separator/tertiary'
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
                        hover: 'surface/fill/quarternary',
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
                  backgroundColor='separator/tertiary'
                  height='full'
                  style={{ width: '1px' }}
                />
              </Column>
              <Column>
                <Link to='session' style={{ height: '100%' }}>
                  <Box
                    alignItems='center'
                    backgroundColor={{
                      hover: 'surface/fill/quarternary',
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
                  backgroundColor='separator/tertiary'
                  height='full'
                  style={{ width: '1px' }}
                />
              </Column>
              <Column width='content'>
                <Box
                  alignItems='center'
                  as='button'
                  backgroundColor={{
                    hover: 'surface/fill/quarternary',
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
          <Box
            borderColor='separator/tertiary'
            borderBottomWidth='1px'
            width='full'
          >
            <Link to='network' style={{ height: '100%' }}>
              <Box
                backgroundColor={{
                  hover: 'surface/fill/quarternary',
                }}
                height='full'
                paddingLeft='12px'
                style={{ cursor: 'default' }}
              >
                <Columns>
                  <Column>
                    <Columns gap='16px'>
                      <Column alignVertical='center' width='1/3'>
                        <HeaderItem label='RPC URL'>
                          <Inline gap='4px' wrap={false}>
                            <Box
                              backgroundColor={
                                status === 'pending'
                                  ? 'surface/invert@0.5'
                                  : listening
                                  ? 'surface/green'
                                  : 'surface/red'
                              }
                              borderWidth='1px'
                              borderRadius='round'
                              style={{ minWidth: 8, minHeight: 8 }}
                            />
                            <Text size='12px' wrap={false} width='full'>
                              {network.rpcUrl.replace(/https?:\/\//, '')}
                            </Text>
                          </Inline>
                        </HeaderItem>
                      </Column>
                      <Column alignVertical='center' width='1/3'>
                        <HeaderItem label='Chain'>
                          <Text size='12px' wrap={false} width='full'>
                            {network.chainId}: {network.name}
                          </Text>
                        </HeaderItem>
                      </Column>
                      <Column alignVertical='center' width='1/3'>
                        <Inset left='12px' right='8px'>
                          <Box style={{ width: '80px' }}>
                            <HeaderItem label='Block'>
                              <Text size='12px'>{blockNumber?.toString()}</Text>
                            </HeaderItem>
                          </Box>
                        </Inset>
                      </Column>
                    </Columns>
                  </Column>
                </Columns>
              </Box>
            </Link>
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
      <Text color='text/tertiary' size='9px' wrap={false}>
        {label.toUpperCase()}
      </Text>
      <Box>{children}</Box>
    </Stack>
  )
}
