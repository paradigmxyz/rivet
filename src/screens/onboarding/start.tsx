import { Cogs } from '../../components/icons/Cogs'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Inline,
  Inset,
  Row,
  Rows,
  Stack,
  Text,
} from '~/design-system'

export default function OnboardingStart() {
  return (
    <Inset height='full' horizontal='20px' vertical='20px'>
      <Rows>
        <Row>
          <Cogs size='100%' />
        </Row>
        <Row alignVertical='bottom'>
          <Stack gap='32px'>
            <Stack gap='20px'>
              <Text size='32px' weight='medium'>
                Rivet
              </Text>
              <Text color='label' size='18px' weight='light'>
                An open-source wallet with a powerful set of developer tools.
              </Text>
            </Stack>
            <Stack gap='24px'>
              <Inline alignVertical='center' gap='12px' wrap={false}>
                <Box
                  backgroundColor='primary / 0.2'
                  style={{
                    borderRadius: '100%',
                    minWidth: '40px',
                    minHeight: '40px',
                  }}
                />
                <Stack gap='12px'>
                  <Text size='16px' weight='medium'>
                    Configure chains
                  </Text>
                  <Text color='label'>Customize your Anvil instances</Text>
                </Stack>
              </Inline>
              <Inline alignVertical='center' gap='12px' wrap={false}>
                <Box
                  backgroundColor='primary / 0.2'
                  style={{
                    borderRadius: '100%',
                    minWidth: '40px',
                    minHeight: '40px',
                  }}
                />
                <Stack gap='12px'>
                  <Text size='16px' weight='medium'>
                    Manage accounts
                  </Text>
                  <Text color='label'>Set balances, impersonate, etc.</Text>
                </Stack>
              </Inline>
              <Inline alignVertical='center' gap='12px' wrap={false}>
                <Box
                  backgroundColor='primary / 0.2'
                  style={{
                    borderRadius: '100%',
                    minWidth: '40px',
                    minHeight: '40px',
                  }}
                />
                <Stack gap='12px'>
                  <Text size='16px' weight='medium'>
                    Time travel
                  </Text>
                  <Text color='label'>Snapshot & revert history</Text>
                </Stack>
              </Inline>
            </Stack>
            <Stack gap='12px'>
              <Link to='/onboarding/create-hosted'>
                <Button height='44px'>Create hosted chain</Button>
              </Link>
              <Button height='44px' variant='stroked scrim'>
                Use local chain
              </Button>
            </Stack>
          </Stack>
        </Row>
      </Rows>
    </Inset>
  )
}
