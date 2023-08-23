import type { ReactNode } from 'react'

import type { StackProps } from '../design-system/components/Stack'
import { Box, Stack, Text } from '~/design-system'

export function LabelledContent({
  children,
  label,
  width,
}: { children: ReactNode; label: string; width?: StackProps['width'] }) {
  return (
    <Stack gap="8px" width={width}>
      <Text color="text/tertiary" size="9px" wrap={false}>
        {label.toUpperCase()}
      </Text>
      <Box>{children}</Box>
    </Stack>
  )
}
