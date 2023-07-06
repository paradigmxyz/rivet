import type { ReactNode } from 'react'
import {
  Box,
  Inline,
  Inset,
  Row,
  Rows,
  SFSymbol,
  Separator,
  Text,
} from '~/design-system'
import type { RowProps } from '~/design-system/components/Rows'

export function Container({
  alignVertical,
  children,
  dismissable,
  header,
  verticalInset = true,
  fit,
  footer,
  scrollable = true,
}: {
  alignVertical?: RowProps['alignVertical']
  children: ReactNode
  dismissable?: boolean
  header?: string | ReactNode
  verticalInset?: boolean
  fit?: boolean
  footer?: ReactNode
  scrollable?: boolean
}) {
  return (
    <Rows fit={fit}>
      <Row
        alignVertical={alignVertical}
        style={{ overflowY: scrollable ? 'scroll' : undefined }}
      >
        <Rows>
          {header && (
            <>
              <Row height='content'>
                <Box
                  alignItems='center'
                  backgroundColor='surface/primary/elevated'
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
                      <Box cursor='pointer' onClick={() => history.back()}>
                        <SFSymbol
                          color='text/tertiary'
                          size='12px'
                          symbol='xmark'
                          weight='medium'
                        />
                      </Box>
                    )}
                  </Inline>
                </Box>
              </Row>
              <Row height='content'>
                <Inset horizontal='12px'>
                  <Separator />
                </Inset>
              </Row>
            </>
          )}
          <Box
            paddingHorizontal='12px'
            paddingVertical={verticalInset ? (header ? '16px' : '12px') : '0px'}
            height='full'
            width='full'
          >
            {children}
          </Box>
        </Rows>
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
