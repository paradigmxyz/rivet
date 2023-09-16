import { Box } from '~/design-system'

import type { Toast } from 'react-hot-toast'
import { Spinner } from '../svgs'

export function LoadingToast({ message }: { message: Toast['message'] }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      paddingHorizontal="12px"
      paddingVertical="6px"
      borderRadius="round"
      backgroundColor={'separator/tertiary'}
    >
      <Box paddingRight="4px">
        <Spinner size="12px" />
      </Box>
      {/* message can be a render function or a simple string this syntax is required for type purposes */}
      {typeof message === 'string' ? message : <>{message}</>}
    </Box>
  )
}
