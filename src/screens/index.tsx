import { Container } from '~/components'
import { Wallet } from '~/components/icons/Wallet'
import { Stack, Text } from '~/design-system'

export default function Index() {
  return (
    <Container alignVertical='center'>
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
    </Container>
  )
}
