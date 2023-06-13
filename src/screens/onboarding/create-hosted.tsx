import { humanId } from 'human-id'
import qs from 'qs'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Container } from '~/components'
import {
  Box,
  Button,
  Input,
  Inset,
  Separator,
  Stack,
  Text,
} from '~/design-system'

export default function OnboardingCreateHosted() {
  const defaultName = useMemo(
    () => humanId({ separator: '-', capitalize: false }),
    [],
  )

  type FormValues = {
    chainId: string
    forkBlockNumber: string
    forkUrl: string
    name: string
  }
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      chainId: '1',
      forkUrl: 'https://cloudflare-eth.com',
      name: defaultName,
    },
  })

  const navigate = useNavigate()

  const submit = handleSubmit((values) => {
    navigate(`/onboarding/deploy-hosted?${qs.stringify(values)}`)
  })

  return (
    <form onSubmit={submit} style={{ height: '100%' }}>
      <Container
        header={
          <Inset vertical='20px'>
            <Stack gap='12px'>
              <Text color='text/tertiary' size='14px'>
                Setup
              </Text>
              <Text>Configure Options</Text>
            </Stack>
          </Inset>
        }
        footer={
          <Stack gap='16px'>
            <Button height='44px'>Deploy node</Button>
            <Box paddingTop='4px' paddingBottom='12px'>
              <Text color='text/tertiary'>Cancel setup</Text>
            </Box>
          </Stack>
        }
      >
        <Stack gap='24px'>
          <Box style={{ position: 'relative' }}>
            <Stack gap='12px'>
              <Text color='text/tertiary' size='12px'>
                Name
              </Text>
              <Input {...register('name', { required: true })} />
              <Text
                style={{
                  position: 'absolute',
                  bottom: 13,
                  right: 13,
                  opacity: 0.5,
                }}
              >
                .riv.et
              </Text>
            </Stack>
          </Box>
          <Stack gap='16px'>
            <Stack gap='16px'>
              <Text>Configure Fork</Text>
              <Separator />
            </Stack>
            <Stack gap='12px'>
              <Text color='text/tertiary' size='12px'>
                Chain ID
              </Text>
              <Input {...register('chainId')} />
            </Stack>
            <Stack gap='12px'>
              <Text color='text/tertiary' size='12px'>
                RPC URL
              </Text>
              <Input {...register('forkUrl')} />
            </Stack>
            <Stack gap='12px'>
              <Text color='text/tertiary' size='12px'>
                Block number
              </Text>
              <Input {...register('forkBlockNumber')} />
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </form>
  )
}
