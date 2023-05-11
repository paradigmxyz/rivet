import { Link } from 'react-router-dom'
import { Wallet } from '../components/icons/Wallet'
import { Box } from '../design-system/components/Box'
import { Button } from '../design-system/components/Button'
import { Stack } from '../design-system/components/Stack'
import { Text } from '../design-system/components/Text'

export function OnboardingStart() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center" style={{ flex: 1 }}>
        <Stack alignHorizontal="center" gap="20px">
          <Wallet size="136px" />
          <Text as="h1" size="32px" weight="medium">
            Dev Wallet
          </Text>
          <Text align="center" size="18px">
            Start using the most powerful, open-source, and developer-focused
            wallet to build your decentralized apps.
          </Text>
        </Stack>
      </Box>
      <Stack gap="8px">
        <Link to="create-wallet">
          <Button as="div">
            Create a new wallet
          </Button>
        </Link>
        <Button variant="stroked scrim">Import existing</Button>
      </Stack>
    </Box>
  )
}
