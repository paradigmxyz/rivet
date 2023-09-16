import { Box, SFSymbol } from '~/design-system'

import type { Toast } from 'react-hot-toast'

export function SuccessToast({ message }: { message: Toast['message'] }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      paddingHorizontal="12px"
      paddingVertical="6px"
      borderRadius="round"
      backgroundColor={'surface/white'}
    >
      <Box paddingRight="4px">
        <SFSymbol symbol="checkmark" size="9px" />
      </Box>
      {/*  */}
      {typeof message === 'string' ? message : <>{message}</>}
    </Box>
  )
}
