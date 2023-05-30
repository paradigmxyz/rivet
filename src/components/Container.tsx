import type { ReactNode } from 'react'
import { Box, Row, Rows } from '~/design-system'
import type { RowProps } from '~/design-system/components/Rows'

export function Container({
  alignVertical,
  children,
  footer,
}: {
  alignVertical?: RowProps['alignVertical']
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <Rows>
      <Row alignVertical={alignVertical} style={{ overflowY: 'scroll' }}>
        <Box paddingHorizontal='12px' paddingVertical='20px'>
          {children}
        </Box>
      </Row>
      {footer && (
        <Row height='content'>
          <Box padding='12px' width='full'>
            {footer}
          </Box>
        </Row>
      )}
    </Rows>
  )
}
