import { Box } from '../../design-system/components/Box'
import { OnboardingStart } from '../../screens/OnboardingStart'

export default function TabsIndex() {
  return (
    <Box
      backgroundColor="body"
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: '100vh',
      }}
    >
      <Box
        backgroundColor="surface"
        borderWidth="1px"
        display="flex"
        padding="16px"
        style={{
          height: 560,
          width: 360,
        }}
      >
        <OnboardingStart />
      </Box>
    </Box>
  )
}
