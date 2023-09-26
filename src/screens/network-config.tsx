import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { Container } from '~/components'
import * as Form from '~/components/form'
import { Button, Stack, Text } from '~/design-system'
import { useDebounce } from '~/hooks/useDebounce'
import { getClient } from '~/viem'
import { useNetworkStore } from '~/zustand'

export default function Network() {
  const { networks, upsertNetwork } = useNetworkStore()
  const { rpcUrl } = useParams()

  const network = useMemo(
    () => networks.find((n) => n.rpcUrl === rpcUrl),
    [networks, rpcUrl],
  )

  type FormValues = {
    name: string
    rpcUrl: string
  }
  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { name: network?.name || '', rpcUrl: network?.rpcUrl || '' },
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

  const onSubmit = handleSubmit(async ({ name, rpcUrl }) => {
    await upsertNetwork({ rpcUrl: network?.rpcUrl, network: { name, rpcUrl } })
    history.back()
  })

  return (
    <Form.Root onSubmit={onSubmit} style={{ height: '100%' }}>
      <Container
        dismissable
        header="Network Configuration"
        footer={<Button type="submit">Update</Button>}
      >
        <Stack gap="20px">
          <Form.InputField
            disabled
            label="Chain ID"
            name="chainId"
            placeholder="1"
            value={chainId || network?.chainId}
          />
          <Form.InputField
            label="RPC URL"
            placeholder="http://localhost:8545"
            register={register('rpcUrl', { required: true })}
            hint={
              isOffline ? (
                <Text color="surface/yellow" size="12px">
                  Network is offline
                </Text>
              ) : undefined
            }
            state={isOffline ? 'warning' : undefined}
          />
          <Form.InputField
            label="Name"
            placeholder="Ethereum"
            register={register('name')}
          />
        </Stack>
      </Container>
    </Form.Root>
  )
}
