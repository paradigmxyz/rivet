import { Root, Trigger, Content } from "@radix-ui/react-popover";
import { type ReactNode, useState } from 'react'

import * as Form from '~/components/form'
import { Box, Button, Stack } from '~/design-system'

export type PopoverFormProps = {
  children: ReactNode,
  isValid: boolean,
  onSubmit: (e: React.FormEvent) => void,
}

function PopoverForm({ children, isValid, onSubmit }: PopoverFormProps) {
  const [ open, setOpen ] = useState(false)

  return  (
      <Root open={open}>
        <Trigger asChild>
            <Button.Symbol
              label="Edit"
              height="12px"
              onClick={() => {setOpen(true)}}
              symbol="square.and.pencil"
              variant="ghost primary"
            />
        </Trigger>
        <Content 
          onEscapeKeyDown={() => setOpen(false)}
          onPointerDownOutside={() => setOpen(false)}
          style={{zIndex: 1}}
        >
          <Box
            backgroundColor="surface/secondary/elevated"
            borderWidth="1px"
            gap="4px"
            padding="8px"
            width="full"
          >
            <Form.Root onSubmit={(e) => {onSubmit(e); setOpen(false)}}>
              <Stack gap="12px">
                  { children }
                  <Button disabled={!isValid} type="submit">Update</Button>
              </Stack>
            </Form.Root>
          </Box>
        </Content>
      </Root>
  )
}

export const Popover = Object.assign({}, {
  Form: PopoverForm,
})
