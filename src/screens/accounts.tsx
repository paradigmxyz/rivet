import { Link } from 'react-router-dom'

import { Container } from '~/components'
import { Box, Inline, SFSymbol, Text } from '~/design-system'
import { useAccount, useNetwork } from '~/zustand'

export default function Accounts() {
  const {
    network: { rpcUrl },
  } = useNetwork()
  const { account, accountsForRpcUrl, setAccount } = useAccount()

  return (
    <Container
      header={
        <Inline alignVertical='center' alignHorizontal='justify' wrap={false}>
          <Text size='16px'>Accounts</Text>
          <Link to='/'>
            <SFSymbol
              color='label'
              size='12px'
              symbol='xmark'
              weight='medium'
            />
          </Link>
        </Inline>
      }
    >
      {accountsForRpcUrl({ rpcUrl }).map((account_) => (
        <Box marginHorizontal='-12px'>
          <Box
            as='button'
            alignItems='center'
            backgroundColor={
              account?.address === account_.address
                ? 'primary / 0.1'
                : {
                    hover: 'primary / 0.05',
                  }
            }
            display='flex'
            onClick={() => setAccount({ account: account_ })}
            paddingHorizontal='12px'
            width='full'
            style={{ cursor: 'default', height: '28px' }}
          >
            <Text size='12px'>{account_.address}</Text>
          </Box>
        </Box>
      ))}
    </Container>
  )
}
