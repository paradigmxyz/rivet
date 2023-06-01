import type { ReactNode } from 'react'
import { Box, Inset, Row, Rows, Separator, Stack } from '~/design-system'
import type { RowProps } from '~/design-system/components/Rows'

export function Container({
  alignVertical,
  children,
  header,
  footer,
}: {
  alignVertical?: RowProps['alignVertical']
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
}) {
  return (
    <Rows>
      <Row alignVertical={alignVertical} style={{ overflowY: 'scroll' }}>
        <Stack>
          {header && (
            <>
              <Box
                alignItems='center'
                backgroundColor='surface'
                display='flex'
                paddingHorizontal='12px'
                paddingVertical='16px'
                width='full'
              >
                {header}
              </Box>
              <Inset horizontal='12px'>
                <Separator />
              </Inset>
            </>
          )}
          <Box paddingHorizontal='12px' paddingVertical='20px' width='full'>
            {children}
          </Box>
        </Stack>
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
