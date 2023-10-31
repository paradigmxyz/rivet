import type { ReactNode } from 'react'

import { Box, Stack, Text } from '~/design-system'

import type { StackProps } from '../design-system/components/Stack'
import type { TextStyles } from '../design-system/components/Text.css'

export function LabelledContent({
  children,
  label,
  labelRight,
  labelColor = 'text/tertiary',
  width,
}: {
  children: ReactNode
  label: string
  labelRight?: ReactNode
  labelColor?: TextStyles['color']
  width?: StackProps['width']
}) {
  return (
    <Stack gap="8px" width={width}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="flex-end"
        gap="2px"
        position="relative"
      >
        <Text color={labelColor} size="9px" wrap={false}>
          {label.toUpperCase()}
        </Text>
        <Box style={{ marginBottom: '-2px' }}>{labelRight}</Box>
      </Box>
      <Box>{children}</Box>
    </Stack>
  )
}
