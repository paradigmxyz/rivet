import * as Popover from '@radix-ui/react-popover'
import { type ReactNode, useState } from 'react'

import { Box, Button, Stack } from '~/design-system'
import * as Form from './form'

export function FormPopover({
  children,
  disabled,
  onSubmit,
}: {
  children: ReactNode
  disabled: boolean
  onSubmit: (e: React.FormEvent) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover.Root open={open}>
      <Popover.Trigger asChild>
        <Box position="absolute" style={{ top: -6 }}>
          <Button.Symbol
            label="Edit"
            height="16px"
            onClick={() => setOpen(true)}
            symbol="square.and.pencil"
            variant="ghost primary"
          />
        </Box>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          onEscapeKeyDown={() => setOpen(false)}
          onPointerDownOutside={() => setOpen(false)}
          style={{ zIndex: 1 }}
        >
          <Box
            backgroundColor="surface/secondary/elevated"
            borderWidth="1px"
            gap="4px"
            padding="8px"
            width="full"
          >
            <Form.Root
              onSubmit={(e) => {
                onSubmit(e)
                setOpen(false)
              }}
            >
              <Stack gap="8px">
                {children}
                <Button
                  disabled={disabled}
                  height="20px"
                  type="submit"
                  variant="stroked fill"
                  width="fit"
                >
                  Update
                </Button>
              </Stack>
            </Form.Root>
          </Box>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
