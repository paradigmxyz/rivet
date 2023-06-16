import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '~/components'
import { Box, Inset, Stack, Text } from '~/design-system'

export function OnboardingContainer({
  children,
  footer,
  title,
}: { children: ReactNode; footer?: ReactNode; title: string }) {
  return (
    <Container
      header={
        <Inset vertical='16px'>
          <Stack gap='12px'>
            <Text color='text/tertiary' size='14px'>
              Setup
            </Text>
            <Text>{title}</Text>
          </Stack>
        </Inset>
      }
      footer={
        <Stack gap='16px'>
          {footer}
          <Link to='/'>
            <Box paddingTop='4px' paddingBottom='12px'>
              <Text color='text/tertiary'>Cancel setup</Text>
            </Box>
          </Link>
        </Stack>
      }
    >
      {children}
    </Container>
  )
}
