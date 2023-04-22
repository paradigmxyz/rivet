import { Box } from "../../design-system/components/Box";
import { OnboardingStart } from "../../screens/OnboardingStart";

export default function TabsIndex() {
  return (
    <Box
      className={[
        'bg-primary',
        'text-white',
        'flex',
        'justify-center',
        'items-center',
        'min-h-screen',
      ]}
    >
      <Box
        className={[
          'flex',
          'border-neutral-700',
          'border-[1px]',
          'rounded-12px',
          'bg-surface',
          'h-[560px]',
          'w-[360px]',
          'p-16px',
        ]}
      >
        <OnboardingStart />
      </Box>
    </Box>
  )
}
