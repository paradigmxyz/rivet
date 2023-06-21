import type { ReactNode } from 'react'
import { type Address, formatEther } from 'viem'

import { Container } from '~/components'
import { Box, Columns, Separator, Stack, Text } from '~/design-system'
import { useBalance, useNonce } from '~/hooks'
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
    <>
      <Container header='Accounts'>
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
      </Container>
    </>
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
