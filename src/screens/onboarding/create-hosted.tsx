import * as Form2 from '@radix-ui/react-form'
import { humanId } from 'human-id'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { OnboardingContainer } from '~/components'
import * as Form from '~/components/form'
import {
  Box,
  Button,
  Inline,
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
    autoMine: boolean
    blockBaseFeePerGas: string
    blockTime: string
    chainId: string
    forkBlockNumber: string
    forkUrl: string
    gasLimit: string
    gasPrice: string
    name: string
  }
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      autoMine: true,
      chainId: '1',
      forkUrl: 'https://cloudflare-eth.com',
      name: defaultName,
    },
  })

  const watchAutoMine = watch('autoMine')
  useEffect(() => {
    if (watchAutoMine) setValue('blockTime', '')
  }, [watchAutoMine])

  const watchBlockTime = watch('blockTime')
  useEffect(() => {
    if (watchBlockTime) setValue('autoMine', false)
  }, [watchBlockTime])

  const navigate = useNavigate()

  const submit = handleSubmit((values_) => {
    const values = {
      ...values_,
      autoMine: String(values_.autoMine),
    }
    const search = new URLSearchParams(values)
    navigate(`/onboarding/deploy-hosted?${search.toString()}`)
  })

  return (
    <Form.Root onSubmit={submit} style={{ height: '100%' }}>
      <OnboardingContainer
        title='Configure Options'
        footer={<Button height='44px'>Deploy node</Button>}
      >
        <Stack gap='24px'>
          <Form.InputField
            defaultValue={defaultName}
            innerRight={<Text color='text/tertiary'>.riv.et</Text>}
            label='Name'
            register={register('name')}
            required
          />
          <Stack gap='16px'>
            <Text>Configure Fork</Text>
            <Separator />
            <Form.InputField
              defaultValue={1}
              label='Chain ID'
              min={1}
              register={register('chainId')}
              type='number'
            />
            <Form.InputField
              defaultValue='https://cloudflare-eth.com'
              label='RPC URL'
              register={register('forkUrl')}
            />
            <Form.InputField
              label='Block Number'
              min={1}
              type='number'
              register={register('forkBlockNumber')}
            />
          </Stack>
          <Stack gap='16px'>
            <Text>Configure Blocks</Text>
            <Separator />
            <Form2.Field name={register.name}>
              <Inset bottom='2px'>
                <Inline alignVertical='center' gap='4px'>
                  <Form2.Control asChild {...register('autoMine')}>
                    <Box as='input' type='checkbox' />
                  </Form2.Control>
                  <Form2.Label>
                    <Text color='text/tertiary' size='12px'>
                      Auto-mine transactions
                    </Text>
                  </Form2.Label>
                </Inline>
              </Inset>
            </Form2.Field>
            <Form.InputField
              label='Block Time (sec)'
              min={0}
              type='number'
              register={register('blockTime')}
            />
            <Form.InputField
              label='Base Fee (gwei)'
              min={0}
              type='number'
              register={register('blockBaseFeePerGas')}
            />
            <Form.InputField
              label='Gas Limit (gwei)'
              min={0}
              type='number'
              register={register('gasLimit')}
            />
            <Form.InputField
              label='Gas Price (gwei)'
              min={0}
              type='number'
              register={register('gasPrice')}
            />
          </Stack>
        </Stack>
      </OnboardingContainer>
    </Form.Root>
  )
}
