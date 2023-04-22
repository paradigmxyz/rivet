import { Box } from '../../design-system/components/Box'
import { Button } from '../../design-system/components/Button'
import { SFSymbol } from '../../design-system/components/SFSymbol'
import { Stack } from '../../design-system/components/Stack'
import { Text } from '../../design-system/components/Text'

export default function DesignSystem() {
  return (
    <Box className={['max-w-6xl', 'mx-auto', 'pt-40px']}>
      <Stack gap="72px">
        <Text weight="semibold" size="48px">
          Design System
        </Text>
        <Box className={['bg-surface', '-m-24px', 'rounded-12px', 'p-24px']}>
          <Stack gap="24px">
            <Text weight="medium" size="24px">
              Button
            </Text>
            <Stack gap="16px">
              <Text weight="medium" size="20px">
                Default
              </Text>
              <Box className={['flex', 'gap-8px']}>
                <Button width="fit">Continue</Button>
                <Button color="primary" width="fit">
                  Continue
                </Button>
              </Box>
            </Stack>
            <Stack gap="16px">
              <Text weight="medium" size="20px">
                Stroked
              </Text>
              <Box className={['flex', 'gap-8px']}>
                <Button color="accent" variant="stroked" width="fit">
                  Continue
                </Button>
                <Button color="label" variant="stroked" width="fit">
                  Continue
                </Button>
              </Box>
            </Stack>
            <Stack gap="16px">
              <Text weight="medium" size="20px">
                Height
              </Text>
              <Box className={['flex', 'gap-8px']}>
                <Button height="52px" width="fit">
                  Continue
                </Button>
                <Button height="40px" width="fit">
                  Continue
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
        <Box className={['bg-surface', '-m-24px', 'rounded-12px', 'p-24px']}>
          <Stack gap="24px">
            <Text weight="medium" size="24px">
              SFSymbol
            </Text>
            <Box className={['flex', 'gap-8px']}>
              <SFSymbol size="24px" symbol="wallet.pass" />
              <SFSymbol size="24px" symbol="person.circle" />
            </Box>
          </Stack>
        </Box>
        <Box className={['bg-surface', '-m-24px', 'rounded-12px', 'p-24px']}>
          <Stack gap="24px">
            <Text weight="medium" size="24px">
              Stack
            </Text>
            <Stack gap="16px">
              <Box className={['bg-primary', 'h-40px']} />
              <Box className={['bg-primary', 'h-40px']} />
              <Box className={['bg-primary', 'h-40px']} />
            </Stack>
          </Stack>
        </Box>
        <Box className={['bg-surface', '-m-24px', 'rounded-12px', 'p-24px']}>
          <Stack gap="24px">
            <Text weight="medium" size="24px">
              Text
            </Text>
            <Box className={['flex', 'gap-8px']}>
              <Stack gap="2px">
                <Text weight="light" size="12px">
                  12px light
                </Text>
                <Text weight="regular" size="12px">
                  12px regular
                </Text>
                <Text weight="medium" size="12px">
                  12px medium
                </Text>
                <Text weight="semibold" size="12px">
                  12px semibold
                </Text>
                <Text weight="bold" size="12px">
                  12px bold
                </Text>
              </Stack>
              <Stack gap="2px">
                <Text weight="light" size="16px">
                  16px light
                </Text>
                <Text weight="regular" size="16px">
                  16px regular
                </Text>
                <Text weight="medium" size="16px">
                  16px medium
                </Text>
                <Text weight="semibold" size="16px">
                  16px semibold
                </Text>
                <Text weight="bold" size="16px">
                  16px bold
                </Text>
              </Stack>
              <Stack gap="2px">
                <Text weight="light" size="20px">
                  20px light
                </Text>
                <Text weight="regular" size="20px">
                  20px regular
                </Text>
                <Text weight="medium" size="20px">
                  20px medium
                </Text>
                <Text weight="semibold" size="20px">
                  20px semibold
                </Text>
                <Text weight="bold" size="20px">
                  20px bold
                </Text>
              </Stack>
              <Stack gap="2px">
                <Text weight="light" size="24px">
                  24px light
                </Text>
                <Text weight="regular" size="24px">
                  24px regular
                </Text>
                <Text weight="medium" size="24px">
                  24px medium
                </Text>
                <Text weight="semibold" size="24px">
                  24px semibold
                </Text>
                <Text weight="bold" size="24px">
                  24px bold
                </Text>
              </Stack>
              <Stack gap="2px">
                <Text weight="light" size="32px">
                  32px light
                </Text>
                <Text weight="regular" size="32px">
                  32px regular
                </Text>
                <Text weight="medium" size="32px">
                  32px medium
                </Text>
                <Text weight="semibold" size="32px">
                  32px semibold
                </Text>
                <Text weight="bold" size="32px">
                  32px bold
                </Text>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
