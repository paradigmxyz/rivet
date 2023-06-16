import { Link } from 'react-router-dom'
import { OnboardingContainer } from '~/components'
import { Box, Button, SFSymbol, Stack, Text } from '~/design-system'

export default function OnboardingDownload() {
  return (
    <OnboardingContainer
      title='Install Foundry'
      footer={
        <Link to='/onboarding/configure?type=local'>
          <Button height='44px'>Continue</Button>
        </Link>
      }
    >
      <Stack gap='20px'>
        <Text color='text/secondary' size='14px'>
          Rivet requires Foundry Anvil to run a local chain.
        </Text>
        <Text color='text/secondary' size='14px'>
          Run the following command in your CLI to install Foundry:
        </Text>
        <Box
          as='pre'
          alignItems='center'
          backgroundColor='surface/fill/tertiary'
          display='flex'
          justifyContent='center'
          paddingVertical='16px'
          paddingLeft='12px'
          paddingRight='32px'
          position='relative'
          // @ts-expect-error
          style={{ textWrap: 'wrap' }}
        >
          <Text as='code' size='12px'>
            curl -L https://foundry.paradigm.xyz | bash
          </Text>
          <Box
            as='button'
            alignItems='center'
            display='flex'
            backgroundColor={{
              hover: 'surface/fill/secondary',
            }}
            borderRadius='3px'
            onClick={() =>
              navigator.clipboard.writeText(
                'curl -L https://foundry.paradigm.xyz | bash',
              )
            }
            justifyContent='center'
            position='absolute'
            right='12px'
            style={{ width: '24px', height: '24px' }}
            transform={{ hoveractive: 'shrink95' }}
          >
            <SFSymbol symbol='doc.on.doc' size='16px' />
          </Box>
        </Box>
        <Text color='text/secondary' size='14px'>
          When installed, you can continue.
        </Text>
      </Stack>
    </OnboardingContainer>
  )
}
