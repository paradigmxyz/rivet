import { Link } from 'react-router-dom'
import { OnboardingContainer } from '~/components'
import { Box, Button, Stack, Text } from '~/design-system'

export default function OnboardingDownload() {
  return (
    <OnboardingContainer
      title="Install Foundry"
      footer={
        <Link to="/onboarding/configure?type=local">
          <Button height="44px">Continue</Button>
        </Link>
      }
    >
      <Stack gap="20px">
        <Text color="text/secondary" size="14px">
          Rivet requires Foundry Anvil to run a local chain.
        </Text>
        <Text color="text/secondary" size="14px">
          Run the following command in your CLI to install Foundry:
        </Text>
        <Box
          as="pre"
          alignItems="center"
          backgroundColor="surface/fill/tertiary"
          display="flex"
          justifyContent="center"
          paddingVertical="16px"
          paddingLeft="12px"
          paddingRight="32px"
          position="relative"
          // @ts-expect-error
          style={{ textWrap: 'wrap' }}
        >
          <Text family="mono" size="12px">
            curl -L https://foundry.paradigm.xyz | bash
          </Text>
          <Box position="absolute" right="12px">
            <Button.Copy
              height="24px"
              variant="ghost primary"
              text="curl -L https://foundry.paradigm.xyz | bash"
            />
          </Box>
        </Box>
        <Text color="text/secondary" size="14px">
          When installed, you can continue.
        </Text>
      </Stack>
    </OnboardingContainer>
  )
}
