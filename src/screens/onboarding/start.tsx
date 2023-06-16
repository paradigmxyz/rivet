import { Link } from 'react-router-dom'

import { Cogs } from '~/components/svgs'
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
        <Row alignHorizontal='center'>
          <Box>
            <Cogs size='100%' />
          </Box>
        </Row>
        <Row alignVertical='bottom' height='content'>
          <Stack gap='32px'>
            <Stack gap='20px'>
              <Text size='32px' weight='medium'>
                Rivet
              </Text>
              <Text color='text/tertiary' size='18px' weight='light'>
                An open-source wallet with a powerful set of developer tools.
              </Text>
            </Stack>
            <Stack gap='24px'>
              <Inline alignVertical='center' gap='12px' wrap={false}>
                <Box
                  alignItems='center'
                  backgroundColor='surface/fill/tertiary'
                  display='flex'
                  justifyContent='center'
                  style={{
                    borderRadius: '100%',
                    fontSize: '18px',
                    minWidth: '40px',
                    minHeight: '40px',
                  }}
                >
                  ⚙️
                </Box>
                <Stack gap='12px'>
                  <Text size='16px' weight='medium'>
                    Configure chains
                  </Text>
                  <Text color='text/tertiary'>
                    Customize your Anvil instances
                  </Text>
                </Stack>
              </Inline>
              <Inline alignVertical='center' gap='12px' wrap={false}>
                <Box
                  alignItems='center'
                  backgroundColor='surface/fill/tertiary'
                  display='flex'
                  justifyContent='center'
                  style={{
                    borderRadius: '100%',
                    fontSize: '18px',
                    minWidth: '40px',
                    minHeight: '40px',
                  }}
                >
                  💳
                </Box>
                <Stack gap='12px'>
                  <Text size='16px' weight='medium'>
                    Manage accounts
                  </Text>
                  <Text color='text/tertiary'>
                    Set balances, impersonate, etc.
                  </Text>
                </Stack>
              </Inline>
              <Inline alignVertical='center' gap='12px' wrap={false}>
                <Box
                  alignItems='center'
                  backgroundColor='surface/fill/tertiary'
                  display='flex'
                  justifyContent='center'
                  style={{
                    borderRadius: '100%',
                    fontSize: '18px',
                    minWidth: '40px',
                    minHeight: '40px',
                  }}
                >
                  📦
                </Box>
                <Stack gap='12px'>
                  <Text size='16px' weight='medium'>
                    Time travel
                  </Text>
                  <Text color='text/tertiary'>Snapshot & revert history</Text>
                </Stack>
              </Inline>
            </Stack>
            <Stack gap='12px'>
              <Link to='/onboarding/configure?type=hosted'>
                <Button height='44px'>Create hosted chain</Button>
              </Link>
              <Link to='/onboarding/download'>
                <Button height='44px' variant='stroked fill'>
                  Use local chain
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Row>
      </Rows>
    </Inset>
  )
}
