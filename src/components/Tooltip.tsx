import {
  Content,
  Portal,
  Provider,
  Root,
  Trigger,
} from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'
import { Box, Text } from '~/design-system'

export type TooltipProps = {
  children: ReactNode
  enabled?: boolean
  label: string | ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ children, enabled, label, side }: TooltipProps) {
  return (
    <Provider>
      <Root delayDuration={300} open={enabled === false ? false : undefined}>
        <Trigger asChild>
          <Box>{children}</Box>
        </Trigger>
        <Portal>
          <Content asChild side={side} sideOffset={8}>
            <Box
              backgroundColor="surface/secondary/elevated"
              borderWidth="1px"
              padding="6px"
              onClick={(e) => {
                e.stopPropagation
                e.preventDefault()
              }}
              style={{ cursor: 'text', pointerEvents: 'visible' }}
            >
              {typeof label !== 'string' ? (
                label
              ) : (
                <Text size="11px">{label}</Text>
              )}
            </Box>
          </Content>
        </Portal>
      </Root>
    </Provider>
  )
}
