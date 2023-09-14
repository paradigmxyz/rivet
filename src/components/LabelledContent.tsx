import type { ReactNode } from 'react'

import { Box, Stack, Text } from '~/design-system'

import type { StackProps } from '../design-system/components/Stack'
import type { TextStyles } from '../design-system/components/Text.css'

export function LabelledContent({
  children,
  label,
  labelColor = 'text/tertiary',
  width,
}: {
  children: ReactNode
  label: string
  labelColor?: TextStyles['color']
  width?: StackProps['width']
}) {
  return (
    <Stack gap="8px" width={width}>
      <Text color={labelColor} size="9px" wrap={false}>
        {label.toUpperCase()}
      </Text>
      <Box>{children}</Box>
    </Stack>
  )
}
