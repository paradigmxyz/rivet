import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Inline,
  Inset,
  Row,
  Rows,
  SFSymbol,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import type { RowProps } from '~/design-system/components/Rows'

export function Container({
  alignVertical,
  children,
  dismissable,
  header,
  fit,
  footer,
}: {
  alignVertical?: RowProps['alignVertical']
  children: ReactNode
  dismissable?: boolean
  header?: string | ReactNode
  fit?: boolean
  footer?: ReactNode
}) {
  return (
    <Rows fit={fit}>
      <Row alignVertical={alignVertical} style={{ overflowY: 'scroll' }}>
        <Stack>
          {header && (
            <>
              <Box
                alignItems='center'
                backgroundColor='surface'
                display='flex'
                paddingHorizontal='12px'
                width='full'
                style={{ minHeight: '44px' }}
              >
                <Inline
                  alignVertical='center'
                  alignHorizontal='justify'
                  wrap={false}
                >
                  {typeof header === 'string' ? (
                    <Text size='16px'>{header}</Text>
                  ) : (
                    header
                  )}
                  {dismissable && (
                    <Link to='..'>
                      <SFSymbol
                        color='label'
                        size='12px'
                        symbol='xmark'
                        weight='medium'
                      />
                    </Link>
                  )}
                </Inline>
              </Box>
              <Inset horizontal='12px'>
                <Separator />
              </Inset>
            </>
          )}
          <Box
            paddingHorizontal='12px'
            paddingVertical={header ? '16px' : '12px'}
            height='full'
            width='full'
          >
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
