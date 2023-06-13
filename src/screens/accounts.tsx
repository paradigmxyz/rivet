import { Container } from '~/components'
import { Box, Text } from '~/design-system'
import { useAccount, useNetwork } from '~/zustand'

export default function Accounts() {
  const {
    network: { rpcUrl },
  } = useNetwork()
  const { account, accountsForRpcUrl, setAccount } = useAccount()

  return (
    <Container dismissable header='Accounts'>
      {accountsForRpcUrl({ rpcUrl }).map((account_) => (
        <Box marginHorizontal='-12px'>
          <Box
            as='button'
            alignItems='center'
            backgroundColor={
              account?.address === account_.address
                ? 'surface/fill/tertiary'
                : {
                    hover: 'surface/fill/quarternary',
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
