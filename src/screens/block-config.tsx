import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { Container } from '~/components'
import * as Form from '~/components/form'
import { Button, Inline, Separator, Stack, Text } from '~/design-system'
import { useClient } from '~/hooks/useClient'
import { useGetAutomine } from '~/hooks/useGetAutomine'
import { useMine } from '~/hooks/useMine'
import { usePendingBlock } from '~/hooks/usePendingBlock'
import { useSetAutomine } from '~/hooks/useSetAutomine'
import { useSetIntervalMining } from '~/hooks/useSetIntervalMining'
import { useNetworkStore } from '~/zustand'

import OnboardingStart from './onboarding/start'

export default function Block() {
  const { onboarded } = useNetworkStore()
  if (!onboarded) return <OnboardingStart />
  return (
    <>
      <Container dismissable fit header="Block Configuration">
        <Stack gap="16px">
          <AutoMining />
          <Separator color="separator/quarternary" />
          <IntervalMining />
          <Separator color="separator/quarternary" />
          <Mine />
          <Separator color="separator/quarternary" />
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
    <Stack gap="16px">
      <Text color="text/tertiary">Auto Mining</Text>
      <Button onClick={() => setAutomine(!automining)} variant="solid fill">
        {automining ? 'Off' : 'On'}
      </Button>
    </Stack>
  )
}

function IntervalMining() {
  const { network } = useNetworkStore()
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
    <Stack gap="16px">
      <Text color="text/tertiary">Interval Mining</Text>
      <Form.Root onSubmit={submit}>
        <Inline gap="8px" wrap={false}>
          <Form.InputField
            label="Interval (s)"
            register={register('interval', { required: true })}
            style={{ width: '70px' }}
          />
          <Stack gap="12px" width="fit">
            {/* TODO: don't do this lol */}
            <Text color="text/tertiary" size="11px">
              {'‎'}
            </Text>
            <Button type="submit" width="fit" variant="solid fill">
              Set
            </Button>
          </Stack>
        </Inline>
      </Form.Root>
      <Button onClick={toggle} variant="solid fill">
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
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: { blocks: '1', interval: '0' },
  })

  const { mutateAsync } = useMine()

  const submit = handleSubmit(async ({ blocks, interval }) => {
    await mutateAsync({
      blocks: Number(blocks),
      interval: Number(interval),
    })
  })

  return (
    <Stack gap="16px">
      <Text color="text/tertiary">Mine Blocks</Text>
      <Form.Root onSubmit={submit}>
        <Inline gap="8px" wrap={false}>
          <Form.InputField
            label="Blocks"
            register={register('blocks', { required: true, min: 1 })}
            style={{ width: '70px' }}
          />
          <Form.InputField
            label="Interval (s)"
            register={register('interval', { required: true })}
            style={{ width: '70px' }}
          />
          <Stack gap="12px" width="fit">
            {/* TODO: don't do this lol */}
            <Text color="text/tertiary" size="11px">
              {'‎'}
            </Text>
            <Button
              disabled={!isValid}
              type="submit"
              width="fit"
              variant="solid fill"
            >
              Mine
            </Button>
          </Stack>
        </Inline>
      </Form.Root>
    </Stack>
  )
}

function Reset() {
  const { data: block } = usePendingBlock()
  const { network } = useNetworkStore()

  const client = useClient()
  const { mutate: reset } = useMutation({
    async mutationFn() {
      await client.reset({
        // TODO: use initial block number specified by user in network setup.
        blockNumber: block?.number!,
        jsonRpcUrl: network.rpcUrl,
      })
    },
  })

  return (
    <Button onClick={() => reset()} variant="solid fill">
      Reset
    </Button>
  )
}
