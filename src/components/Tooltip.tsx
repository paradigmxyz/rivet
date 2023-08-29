import { Content, Provider, Root, Trigger } from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'
import { Text } from '~/design-system'

export type TooltipProps = {
  children: ReactNode
  label: ReactNode
}

export function Tooltip({ children, label }: TooltipProps) {
  return (
    <Provider>
      <Root delayDuration={0}>
        <Trigger asChild>
          <span tabIndex={0}>{children}</span>
        </Trigger>
        <Content>
          <Text size="12px" style={{ padding: '8px' }}>
            {label}
          </Text>
        </Content>
      </Root>
    </Provider>
  )
}
