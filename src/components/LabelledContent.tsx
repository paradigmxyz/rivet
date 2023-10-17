import type { ReactNode } from 'react'

import { Box, Stack, Text } from '~/design-system'

import type { StackProps } from '../design-system/components/Stack'
import type { TextStyles } from '../design-system/components/Text.css'

export function LabelledContent({
  children,
  label,
  labelButton,
  labelColor = 'text/tertiary',
  width,
}: {
  children: ReactNode
  label: string
  labelButton?: ReactNode
  labelColor?: TextStyles['color']
  width?: StackProps['width']
}) {
  return (
    <Stack gap="8px" width={width}>
      { labelButton ? ( 
        <Box display="flex" flexDirection="row" alignItems="flex-end" gap="2px">
          <Text color={labelColor} size="9px" wrap={false}>
            {label.toUpperCase()}
          </Text>
          <Box style={{marginBottom: "-2px"}}>
            {labelButton}
          </Box>
        </Box>
        ) : (
        <Text color={labelColor} size="9px" wrap={false}>
          {label.toUpperCase()}
        </Text>
      )}
      <Box>{children}</Box>
    </Stack>
  )
}
