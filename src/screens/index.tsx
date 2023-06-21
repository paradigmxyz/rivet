// TODO: cleanup

import * as Tabs from '@radix-ui/react-tabs'
import type { ReactNode } from 'react'
import { type Address, formatEther, hexToBigInt } from 'viem'

import { Container } from '~/components'
import { Box, Columns, Inline, Separator, Stack, Text } from '~/design-system'
import { useBalance, useNonce } from '~/hooks'
import { useTxpool } from '~/hooks/useTxpool'
import { truncateAddress } from '~/utils'
import { useAccount, useNetwork } from '~/zustand'

import OnboardingStart from './onboarding/start'

export default function Index() {
  const { onboarded } = useNetwork()
  const {
    network: { rpcUrl },
  } = useNetwork()
  const { accountsForRpcUrl } = useAccount()
  const accounts = accountsForRpcUrl({ rpcUrl })

  if (!onboarded) return <OnboardingStart />
  return (
    <Tabs.Root defaultValue='accounts' asChild>
      <Container
        header={
          <Tabs.List asChild>
            <Inline gap='12px'>
              <Tabs.Trigger asChild value='accounts'>
                <Box cursor='pointer'>
                  <Text size='16px'>Accounts</Text>
                </Box>
              </Tabs.Trigger>
              <Tabs.Trigger asChild value='txpool'>
                <Box cursor='pointer'>
                  <Text size='16px'>Txpool</Text>
                </Box>
              </Tabs.Trigger>
            </Inline>
          </Tabs.List>
        }
      >
        <Tabs.Content value='accounts'>
          <Stack gap='16px'>
            {accounts.map((account) => {
              return (
                <>
                  <Box key={account.address}>
                    <Stack gap='16px'>
                      <HeaderItem label='Address'>
                        <Text size='12px'>{account.address}</Text>
                      </HeaderItem>
                      <Columns>
                        <Balance address={account.address} />
                        <Nonce address={account.address} />
                      </Columns>
                    </Stack>
                  </Box>
                  <Separator />
                </>
              )
            })}
          </Stack>
        </Tabs.Content>
        <Tabs.Content value='txpool'>
          <Txpool />
        </Tabs.Content>
      </Container>
    </Tabs.Root>
  )
}

function Balance({ address }: { address?: Address }) {
  const { data: balance } = useBalance({ address })
  return (
    <HeaderItem label='Balance'>
      {balance ? (
        <Text size='12px'>{Number(formatEther(balance)).toFixed(5)} ETH</Text>
      ) : null}
    </HeaderItem>
  )
}

function Nonce({ address }: { address?: Address }) {
  const { data: nonce } = useNonce({ address })
  return (
    <HeaderItem label='Nonce'>
      {nonce ? <Text size='12px'>{nonce ?? 0}</Text> : null}
    </HeaderItem>
  )
}

function Txpool() {
  const { data: txpool } = useTxpool()

  return (
    <Stack gap='16px'>
      {txpool?.pending.length === 0 && (
        <Text color='text/tertiary'>Txpool is empty</Text>
      )}
      {txpool?.pending.map(([account, transactions]) => {
        return (
          <>
            <Box key={account}>
              <Stack gap='16px'>
                <HeaderItem label='Account'>
                  <Text size='12px'>{account}</Text>
                </HeaderItem>
                <HeaderItem label='Transactions'>
                  <Stack gap='12px'>
                    {transactions.map((transaction) => (
                      <Inline alignHorizontal='justify'>
                        <Text size='12px'>
                          {truncateAddress(transaction.hash)}
                        </Text>
                        <Text size='12px'>
                          {formatEther(hexToBigInt(transaction.value))} ETH
                        </Text>
                      </Inline>
                    ))}
                  </Stack>
                </HeaderItem>
              </Stack>
            </Box>
            <Separator />
          </>
        )
      })}
    </Stack>
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
