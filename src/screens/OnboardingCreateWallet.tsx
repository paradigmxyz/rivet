import { english, generateMnemonic } from 'viem/accounts'

export function OnboardingCreateWallet() {
  const phrase = generateMnemonic(english)

  return <div>{phrase}</div>
}
