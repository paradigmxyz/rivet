import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as chains from 'viem/chains'

import { Container } from '~/components'
import { Button, Input, Stack, Text } from '~/design-system'
import { useDebounce } from '~/hooks/useDebounce'
import { useReset } from '~/hooks/useReset'
import { getClient } from '~/viem'
import { useNetworkStore } from '~/zustand'

export default function Network() {
  const { network, upsertNetwork, switchNetwork } = useNetworkStore()
  const { mutate: reset } = useReset()

  type FormValues = {
    name: string
    rpcUrl: string
  }
  const { register, handleSubmit, setValue, getFieldState, watch } =
    useForm<FormValues>({
      defaultValues: { name: network.name, rpcUrl: network.rpcUrl },
    })

  const debouncedRpcUrl = useDebounce(watch('rpcUrl'), 300)
  const { data: chainId, isError: isOffline } = useQuery({
    enabled: Boolean(debouncedRpcUrl),
    queryKey: ['chainId', debouncedRpcUrl],
    async queryFn() {
      const publicClient = getClient({ rpcUrl: debouncedRpcUrl })
      return publicClient.getChainId()
    },
  })

  useEffect(() => {
    const { isDirty } = getFieldState('name')
    if (isDirty) return
    const name = Object.values(chains).find(
      (chain) => chain.id === chainId,
    )?.name
    setValue('name', name || 'Ethereum')
  }, [chainId, getFieldState, setValue])

  const navigate = useNavigate()

  const onSubmit = handleSubmit(async ({ name, rpcUrl }) => {
    await upsertNetwork({ rpcUrl, network: { name } })
    switchNetwork(rpcUrl)
    navigate('/')
  })

  const handleResetFork = async () => {
    await reset({})
  }

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Container
        dismissable
        header="Network Configuration"
        footer={
          <Stack gap="2px">
            <Button type="submit" onClick={handleResetFork}>
              Reset fork
            </Button>
            <Button type="submit">Update</Button>
          </Stack>
        }
      >
        <Stack gap="20px">
          <Stack gap="12px">
            <Text color="text/tertiary" size="11px">
              Chain ID
            </Text>
            <Input
              disabled
              name="chainId"
              placeholder="1"
              value={chainId || network.chainId}
            />
          </Stack>
          <Stack gap="8px">
            <Stack gap="12px">
              <Text color="text/tertiary" size="11px">
                RPC URL
              </Text>
              <Input
                placeholder="http://localhost:8545"
                state={isOffline ? 'warning' : undefined}
                {...register('rpcUrl', { required: true })}
              />
            </Stack>
            {isOffline && (
              <Text color="surface/yellow" size="11px">
                Warning: Network is offline
              </Text>
            )}
          </Stack>
          <Stack gap="12px">
            <Text color="text/tertiary" size="11px">
              Name
            </Text>
            <Input placeholder="Ethereum" {...register('name')} />
          </Stack>
        </Stack>
      </Container>
    </form>
  )
}
