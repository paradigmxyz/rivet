import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import {
  Box,
  Button,
  Inline,
  Inset,
  Row,
  Rows,
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
  const navigate = useNavigate()
  return (
    <Rows fit={fit}>
      <Row
        alignVertical={alignVertical}
        style={{ overflowY: scrollable ? 'scroll' : undefined }}
      >
        <Rows>
          {header && (
            <>
              <Row height="content">
                <Box
                  alignItems="center"
                  backgroundColor="surface/primary/elevated"
                  display="flex"
                  paddingHorizontal="8px"
                  width="full"
                  style={{ minHeight: '44px' }}
                >
                  <Inline
                    alignVertical="center"
                    alignHorizontal="justify"
                    wrap={false}
                  >
                    {typeof header === 'string' ? (
                      <Text size="16px">{header}</Text>
                    ) : (
                      header
                    )}
                    {dismissable && (
                      <Button.Symbol
                        height="24px"
                        onClick={() => navigate(-1)}
                        symbol="xmark"
                        variant="ghost primary"
                      />
                    )}
                  </Inline>
                </Box>
              </Row>
              <Row height="content">
                <Inset horizontal="8px">
                  <Separator />
                </Inset>
              </Row>
            </>
          )}
          <Box
            paddingHorizontal="8px"
            paddingVertical={verticalInset ? (header ? '16px' : '12px') : '0px'}
            height="full"
            width="full"
          >
            {children}
          </Box>
        </Rows>
      </Row>
      {footer && (
        <Row height="content">
          <Box paddingHorizontal="8px" paddingVertical="12px" width="full">
            {footer}
          </Box>
        </Row>
      )}
    </Rows>
  )
}
