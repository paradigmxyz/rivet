import { Container } from '~/components'
import { useNetwork } from '~/zustand'

import OnboardingStart from './onboarding/start'

export default function Index() {
  const { onboarded } = useNetwork()
  if (!onboarded) return <OnboardingStart />
  return (
    <>
      <Container fit header='Accounts'>
        TODO
      </Container>
    </>
  )
}
