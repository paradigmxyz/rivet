import { humanId } from 'human-id'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { gweiUnits } from 'viem'

import { OnboardingContainer } from '~/components'
import * as Form from '~/components/form'
import { Button, Separator, Stack, Text } from '~/design-system'
import { useNetworkStore } from '~/zustand'

export default function OnboardingConfigure() {
  const [params] = useSearchParams()
  const type = params.get('type')

  const defaultName = useMemo(
    () => humanId({ separator: '-', capitalize: false }),
    [],
  )

  type FormValues = {
    autoMine: boolean
    blockBaseFeePerGas: string
    blockTime: string
    chainId: string
    networkName: string
    forkBlockNumber: string
    forkUrl: string
    gasLimit: string
    gasPrice: string
    name: string
    port: string
  }
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      autoMine: true,
      chainId: '1',
      forkUrl: 'https://cloudflare-eth.com',
      name: defaultName,
      port: '8545',
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

  const { upsertNetwork } = useNetworkStore()
  const submit = handleSubmit((values_) => {
    const values = {
      ...values_,
      autoMine: String(values_.autoMine),
      blockBaseFeePerGas: values_.blockBaseFeePerGas
        ? String(Number(values_.blockBaseFeePerGas) ** gweiUnits.wei)
        : '',
      gasPrice: values_.gasPrice
        ? String(Number(values_.gasPrice) ** gweiUnits.wei)
        : '',
    }

    if (type === 'local')
      upsertNetwork({
        network: {
          blockTime: Number(values.blockTime),
          chainId: Number(values.chainId),
          name: values.networkName,
          rpcUrl: `http://127.0.0.1:${values.port}`,
        },
      })

    const search = new URLSearchParams(values)
    navigate(
      `/onboarding/${
        type === 'hosted' ? 'deploy' : 'run'
      }?${search.toString()}`,
    )
  })

  return (
    <Form.Root onSubmit={submit} style={{ height: '100%' }}>
      <OnboardingContainer
        title='Configure Options'
        footer={
          <>
            {type === 'hosted' && <Button height='44px'>Deploy node</Button>}
            {type === 'local' && <Button height='44px'>Continue</Button>}
          </>
        }
      >
        <Stack gap='32px'>
          <Stack gap='16px'>
            {type === 'local' && (
              <Form.InputField
                defaultValue={defaultName}
                innerLeft={
                  <Text color='text/tertiary'>https://127.0.0.1:</Text>
                }
                label='Port'
                min={1}
                register={register('port')}
                required
                type='number'
              />
            )}
            {type === 'hosted' && (
              <Form.InputField
                defaultValue={defaultName}
                innerRight={<Text color='text/tertiary'>.riv.et</Text>}
                label='Name'
                register={register('name')}
                required
              />
            )}
            <Form.InputField
              defaultValue={1}
              label='Chain ID'
              min={1}
              register={register('chainId')}
              type='number'
            />
            <Form.InputField
              defaultValue='Ethereum'
              label='Network Name'
              register={register('networkName')}
              required
            />
          </Stack>
          <Stack gap='16px'>
            <Text>Configure Fork</Text>
            <Separator />
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
            <Form.CheckboxField
              label='Auto-mine transactions'
              register={register('autoMine')}
            />
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
              label='Gas Price (gwei)'
              min={0}
              type='number'
              register={register('gasPrice')}
            />
            <Form.InputField
              label='Gas Limit'
              min={0}
              type='number'
              register={register('gasLimit')}
            />
          </Stack>
        </Stack>
      </OnboardingContainer>
    </Form.Root>
  )
}
