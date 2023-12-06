import { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Container } from '~/components'
import * as Form from '~/components/form'
import {
  Bleed,
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Separator,
  Stack,
  Text,
} from '~/design-system'
import { useNetworkStatus } from '~/hooks/useNetworkStatus'
import { isDomain } from '~/utils'
import { useNetworkStore } from '~/zustand'
import type { Network } from '~/zustand/network'

export default function Networks() {
  const { network, networks } = useNetworkStore()
  return (
    <Container dismissable header="Networks">
      <Stack gap="8px">
        <ImportNetwork />
        <Bleed horizontal="-8px">
          <Box paddingHorizontal="8px" style={{ height: '24px' }}>
            <Columns gap="4px">
              <Column alignVertical="center" width="content">
                <Box style={{ width: '120px' }}>
                  <Text color="text/tertiary" size="9px" wrap={false}>
                    RPC URL
                  </Text>
                </Box>
              </Column>
              <Column alignVertical="center">
                <Text color="text/tertiary" size="9px" wrap={false}>
                  CHAIN
                </Text>
              </Column>
              <Column width="content">
                <Box style={{ width: '44px' }} />
              </Column>
            </Columns>
          </Box>
          <Separator />
          {networks.map((network_) => (
            <NetworkRow
              key={network_.rpcUrl}
              active={network_.rpcUrl === network.rpcUrl}
              network={network_}
              showRemove={networks.length > 1}
            />
          ))}
        </Bleed>
      </Stack>
    </Container>
  )
}

function ImportNetwork() {
  const { upsertNetwork } = useNetworkStore()
  const { setFocus, handleSubmit, register, reset } = useForm<{
    rpcUrl: string
  }>({
    defaultValues: {
      rpcUrl: '',
    },
  })

  const submit = handleSubmit(async ({ rpcUrl: rpcUrl_ }) => {
    reset()

    const isRpcUrlOrPort =
      isDomain(rpcUrl_) || !/^.*:.*$/.test(rpcUrl_) || !/^\d*$/.test(rpcUrl_)
    if (!isRpcUrlOrPort) {
      toast.error(
        'Invalid RPC URL or port. Enter an RPC URL (e.g. http://localhost:8545) or a port number (e.g. 8545).',
      )
      setFocus('rpcUrl', { shouldSelect: true })
      return
    }

    const rpcUrl = /^\d*$/.test(rpcUrl_)
      ? `http://127.0.0.1:${rpcUrl_}`
      : rpcUrl_

    try {
      // Upsert a placeholder (loading) network.
      await upsertNetwork({
        rpcUrl,
        network: {
          chainId: -1,
          rpcUrl,
        },
      })

      // Upsert the actual network.
      await upsertNetwork({
        rpcUrl,
        network: {
          rpcUrl,
        },
      })
    } catch (error) {
      toast.error((error as Error).message)
    }
  })

  return (
    <Form.Root onSubmit={submit} style={{ width: '100%' }}>
      <Inline gap="4px" wrap={false}>
        <Form.InputField
          height="24px"
          hideLabel
          label="Import address"
          register={register('rpcUrl', {
            required: true,
          })}
          placeholder="Import RPC URL or port..."
        />
        <Button height="24px" variant="stroked fill" width="fit" type="submit">
          Import
        </Button>
      </Inline>
    </Form.Root>
  )
}

function NetworkRow({
  active,
  network,
  showRemove,
}: { active: boolean; network: Network; showRemove: boolean }) {
  const navigate = useNavigate()
  const { data, status } = useNetworkStatus({ rpcUrl: network.rpcUrl })
  const { switchNetwork, removeNetwork } = useNetworkStore()
  return (
    <Fragment key={network.rpcUrl}>
      <Box
        backgroundColor={active ? 'surface/fill/tertiary' : undefined}
        paddingHorizontal="8px"
        paddingVertical="8px"
      >
        <Columns alignVertical="center" gap="4px">
          <Column width="content">
            <Box style={{ width: '120px' }}>
              <Inline gap="8px" wrap={false}>
                <Box
                  backgroundColor={
                    status === 'pending'
                      ? 'surface/invert@0.5'
                      : data
                      ? 'surface/green'
                      : 'surface/red'
                  }
                  borderWidth="1px"
                  borderRadius="round"
                  style={{ width: 8, height: 8 }}
                />
                <Text
                  color={data ? 'text' : 'text/tertiary'}
                  size="12px"
                  wrap={false}
                  style={{overflow: "hidden", textOverflow: "ellipsis"}}
                >
                  {network.rpcUrl.replace(/https?:\/\//, '')}
                </Text>
              </Inline>
            </Box>
          </Column>
          <Column>
            {network.chainId >= 0 && (
              <Text
                color={data ? 'text' : 'text/tertiary'}
                size="12px"
                wrap={false}
              >
                {`${network.chainId.toString()}: ${network.name}`}
              </Text>
            )}
          </Column>
          <Column width="content">
            <Inline gap="4px">
              {showRemove && (
                <Button.Symbol
                  label="Remove"
                  onClick={() => removeNetwork(network.rpcUrl)}
                  height="20px"
                  symbol="trash"
                  variant="stroked red"
                />
              )}
              <Button.Symbol
                label="Edit"
                onClick={() =>
                  navigate(`/networks/${encodeURIComponent(network.rpcUrl)}`)
                }
                height="20px"
                symbol="square.and.pencil"
                variant="stroked fill"
              />
              <Button.Symbol
                label="Switch Network"
                disabled={active || !data}
                onClick={() => switchNetwork(network.rpcUrl)}
                height="20px"
                symbol="arrow.left.arrow.right"
                variant="stroked fill"
              />
            </Inline>
          </Column>
        </Columns>
      </Box>
      <Separator />
    </Fragment>
  )
}
