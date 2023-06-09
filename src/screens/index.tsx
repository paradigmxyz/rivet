import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { Container } from '~/components'
import { Button, Inline, Input, Separator, Stack, Text } from '~/design-system'
import {
  useBlockNumber,
  useBlockNumberQueryOptions,
  useGetAutomine,
  useTestClient,
} from '~/hooks'
import { useSetAutomine } from '~/hooks/useSetAutomine'
import { useSetIntervalMining } from '~/hooks/useSetIntervalMining'
import { queryClient } from '~/react-query'
import { useNetwork } from '~/zustand'

import OnboardingStart from './onboarding/start'

export default function Index() {
  const { onboarded } = useNetwork()
  if (!onboarded) return <OnboardingStart />
  return (
    <>
      <Container fit header='Network'>
        <Stack gap='16px'>
          <AutoMining />
          <Separator />
          <IntervalMining />
          <Separator />
          <Mine />
          <Separator />
          <Reset />
        </Stack>
      </Container>
    </>
  )
}

function AutoMining() {
  const { data: automining } = useGetAutomine()
  const { mutate: setAutomine } = useSetAutomine()

  return (
    <Stack gap='16px'>
      <Text color='label'>Auto Mining</Text>
      <Button onClick={() => setAutomine(!automining)} variant='tint primary'>
        {automining ? 'Off' : 'On'}
      </Button>
    </Stack>
  )
}

function IntervalMining() {
  const { network } = useNetwork()
  const { mutate: setIntervalMining, mutateAsync: setIntervalMiningAsync } =
    useSetIntervalMining()

  type FormValues = {
    interval: string
  }
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { interval: network.blockTime.toString() },
  })

  const submit = handleSubmit(async ({ interval }) => {
    await setIntervalMiningAsync({ interval: Number(interval) })
  })

  const toggle = () =>
    setIntervalMining({ interval: network.blockTime > 0 ? 0 : 1 })

  return (
    <Stack gap='16px'>
      <Text color='label'>Interval Mining</Text>
      <form onSubmit={submit}>
        <Inline gap='8px' wrap={false}>
          <Stack gap='12px' width='fit'>
            <Text color='label' size='11px'>
              Interval (s)
            </Text>
            <Input
              style={{ width: '70px' }}
              {...register('interval', { required: true })}
            />
          </Stack>
          <Stack gap='12px' width='fit'>
            {/* TODO: don't do this lol */}
            <Text color='label' size='11px'>
              {'‎'}
            </Text>
            <Button type='submit' width='fit' variant='tint primary'>
              Set
            </Button>
          </Stack>
        </Inline>
      </form>
      <Button onClick={toggle} variant='tint primary'>
        {network.blockTime > 0 ? 'Pause' : 'Continue'}
      </Button>
    </Stack>
  )
}

function Mine() {
  type FormValues = {
    blocks: string
    interval: string
  }
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { blocks: '1', interval: '0' },
  })

  const { queryKey } = useBlockNumberQueryOptions()
  const testClient = useTestClient()

  const submit = handleSubmit(async ({ blocks, interval }) => {
    await testClient.mine({
      blocks: Number(blocks),
      interval: Number(interval),
    })
    if (Number(interval) === 0)
      queryClient.setQueryData(
        queryKey,
        (prev: bigint | undefined) => prev! + BigInt(blocks),
      )
  })

  return (
    <Stack gap='16px'>
      <Text color='label'>Mine Blocks</Text>
      <form onSubmit={submit}>
        <Inline gap='8px' wrap={false}>
          <Stack gap='12px' width='fit'>
            <Text color='label' size='11px'>
              Blocks
            </Text>
            <Input
              style={{ width: '70px' }}
              {...register('blocks', { required: true })}
            />
          </Stack>
          <Stack gap='12px' width='fit'>
            <Text color='label' size='11px'>
              Interval (s)
            </Text>
            <Input
              style={{ width: '70px' }}
              {...register('interval', { required: true })}
            />
          </Stack>
          <Stack gap='12px' width='fit'>
            {/* TODO: don't do this lol */}
            <Text color='label' size='11px'>
              {'‎'}
            </Text>
            <Button type='submit' width='fit' variant='tint primary'>
              Mine
            </Button>
          </Stack>
        </Inline>
      </form>
    </Stack>
  )
}

function Reset() {
  const { data: blockNumber } = useBlockNumber()
  const { network } = useNetwork()

  const testClient = useTestClient()
  const { mutate: reset } = useMutation({
    async mutationFn() {
      await testClient.reset({
        // TODO: use initial block number specified by user in network setup.
        blockNumber: blockNumber!,
        jsonRpcUrl: network.rpcUrl,
      })
    },
  })

  return (
    <Button onClick={() => reset()} variant='tint primary'>
      Reset
    </Button>
  )
}
