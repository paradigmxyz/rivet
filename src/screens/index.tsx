import { Link } from 'react-router-dom'
import { Wallet } from '~/components/icons/Wallet'
import { Box, Button, Row, Rows, Stack, Text } from '~/design-system'

export default function Index() {
  return (
    <Rows>
      <Row alignVertical='center'>
        <Stack alignHorizontal='center' gap='20px'>
          <Wallet size='136px' />
          <Text as='h1' size='32px' weight='medium'>
            Dev Wallet
          </Text>
          <Text align='center' size='18px'>
            Start using the most powerful, open-source, and developer-focused
            wallet to build your decentralized apps.
          </Text>
        </Stack>
      </Row>
      <Row height='content'>
        <Stack gap='8px'>
          <Box as={Link} to='create-wallet'>
            <Button as='div'>Create a new wallet</Button>
          </Box>
          <Button variant='stroked scrim'>Import preloaded wallets</Button>
        </Stack>
      </Row>
    </Rows>
  )
}
