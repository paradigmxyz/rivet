import { useMutation } from '@tanstack/react-query'
import { type FormEvent, useRef } from 'react'
import { useHref, useNavigate } from 'react-router-dom'

import { Container } from '~/components'
import { Button, Inline, Input, Stack, Text } from '~/design-system'
import { useNetwork } from '~/zustand'

export default function NetworkConfig() {
  const {
    network: { rpcUrl },
    updateNetwork,
  } = useNetwork()

  const formRef = useRef<HTMLFormElement>(null)

  const navigate = useNavigate()
  const href = useHref('/')

  const { mutate: submit } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(formRef.current!)
      const rpcUrl = formData.get('rpcUrl') as string
      await updateNetwork({ rpcUrl })
      navigate('/')
    },
  })

  return (
    <form ref={formRef} onSubmit={submit} style={{ height: '100%' }}>
      <Container
        footer={
          <Inline gap='8px' wrap={false}>
            <Button as='a' href={href} variant='stroked scrim'>
              Back
            </Button>
            <Button type='submit'>Update</Button>
          </Inline>
        }
      >
        <Stack gap='32px'>
          <Text weight='medium' size='22px'>
            Network Config
          </Text>
          <Stack gap='12px'>
            <Text color='label' size='12px' weight='medium'>
              RPC URL
            </Text>
            <Input
              defaultValue={rpcUrl}
              name='rpcUrl'
              placeholder='http://localhost:8545'
            />
          </Stack>
        </Stack>
      </Container>
    </form>
  )
}
