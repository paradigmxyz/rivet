import { Stack } from '../design-system/components/Stack'
import { Text } from '../design-system/components/Text'
import { english, generateMnemonic } from 'viem/accounts'

export function OnboardingCreateWallet() {
  const phrase = generateMnemonic(english)

  return (
    <Stack gap="12px">
      <Text weight="medium" size="22px">
        Create a new wallet
      </Text>
      <Text>Here is your secret phrase. Keep it safe. I trust you.</Text>
      <Text>{phrase}</Text>
    </Stack>
  )
}
