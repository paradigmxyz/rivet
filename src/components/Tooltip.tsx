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
  label: string | ReactNode
}

export function Tooltip({ children, label }: TooltipProps) {
  return (
    <Provider>
      <Root delayDuration={300}>
        <Trigger asChild>
          <Box testId="haha" tabIndex={0}>
            {children}
          </Box>
        </Trigger>
        <Portal>
          <Content asChild side="bottom" sideOffset={8}>
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
