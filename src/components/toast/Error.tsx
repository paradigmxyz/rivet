import { Box, SFSymbol } from '~/design-system'

import type { Toast } from 'react-hot-toast'

export function ErrorToast({ message }: { message: Toast['message'] }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      paddingHorizontal="12px"
      paddingVertical="6px"
      borderRadius="round"
      backgroundColor={'surface/red@0.6'}
    >
      <Box paddingRight="4px">
        <SFSymbol symbol="xmark" size="9px" />
      </Box>
      {/* message can be a render function or a simple string this syntax is required for type purposes */}
      {typeof message === 'string' ? message : <>{message}</>}
    </Box>
  )
}
