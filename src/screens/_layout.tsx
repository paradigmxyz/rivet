import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { Box, Column, Columns, Inline, Row, Rows, Text } from '~/design-system'
import { publicClient, walletClient } from '~/viem'

export default function Layout({ children }: { children: ReactNode }) {
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
          <Box padding='24px'>{children}</Box>
        </Row>
      </Rows>
    </Box>
  )
}

function Header() {
  const { data: listening, status } = useQuery({
    queryKey: ['listening'],
    queryFn: async () => {
      try {
        return await publicClient.request({ method: 'net_listening' })
      } catch {
        return false
      }
    },
    refetchInterval: publicClient.pollingInterval,
  })

  const { data: addresses } = useQuery({
    enabled: listening,
    queryKey: ['addresses'],
    queryFn: walletClient.getAddresses,
  })

  // TODO: retrieve selected account from global sync state (zustand).
  const address = addresses?.[0]

  return (
    <Box
      borderColor='primary / 0.1'
      borderBottomWidth='1px'
      paddingHorizontal='24px'
      width='full'
      style={{ height: '48px' }}
    >
      <Columns alignVertical='center'>
        <Column width='content'>
          <Box
            borderColor='primary / 0.1'
            borderRightWidth='1px'
            display='flex'
            flexDirection='column'
            height='full'
            paddingRight='12px'
            style={{ width: '64px' }}
          >
            <Inline alignVertical='center' gap='8px' wrap={false}>
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
                marginLeft='-12px'
                style={{ width: 10, height: 10 }}
              />
              <Text size='14px'>
                {status === 'pending' ? '…' : listening ? 'Online' : 'Offline'}
              </Text>
            </Inline>
          </Box>
        </Column>
        <Column>
          <Box
            alignItems='center'
            display='flex'
            height='full'
            paddingLeft='12px'
            width='full'
          >
            {listening && address && (
              <Text weight='medium'>{`${address.slice(0, 6)}…${address.slice(
                -4,
              )}`}</Text>
            )}
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}
