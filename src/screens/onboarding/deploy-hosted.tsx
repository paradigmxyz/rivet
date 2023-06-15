import { useQuery } from '@tanstack/react-query'
import qs from 'qs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Cog } from '../../components/svgs'
import { useNetworkStatus } from '../../hooks'
import { Container } from '~/components'
import { Box, Inset, Row, Rows, Stack, Text } from '~/design-system'
import { useNetwork } from '~/zustand'

export default function OnboardingDeployHosted() {
  const navigate = useNavigate()
  const { setOnboarded, upsertNetwork } = useNetwork()

  const params = qs.parse(window.location.hash.split('?')[1]) || {}

  const { data: instance, isSuccess: isInstanceSuccess } = useQuery<any>({
    queryKey: ['instances', params.name],
    queryFn: async () => {
      return await (
        await fetch('https://forked.network/api/instances', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: params.name,
          }),
        })
      ).json()
    },
    retry: true,
    gcTime: 0,
  })

  const { isSuccess: isIpsSuccess } = useQuery<any>({
    enabled: isInstanceSuccess,
    queryKey: ['ips', instance?.name],
    queryFn: async () => {
      await fetch(
        `https://forked.network/api/instances/${instance?.name}/ips`,
        {
          method: 'POST',
        },
      )
      return null
    },
    retry: true,
    gcTime: 0,
  })

  const { data: machine, isSuccess: isMachineSuccess } = useQuery<any>({
    enabled: isIpsSuccess,
    queryKey: ['machines', instance?.name, params],
    queryFn: async () => {
      return (
        await fetch(
          `https://forked.network/api/instances/${instance?.name}/machines`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
          },
        )
      ).json()
    },
    retry: true,
    gcTime: 0,
  })

  const { isSuccess: isWaitSuccess } = useQuery<any>({
    enabled: isMachineSuccess,
    queryKey: ['wait', instance?.name],
    queryFn: async () => {
      await fetch(`https://forked.network/api/instances/${instance?.name}/wait`)
      return null
    },
    retry: true,
    gcTime: 0,
  })

  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (isWaitSuccess) return setProgress(75)
    if (isMachineSuccess) return setProgress(55)
    if (isIpsSuccess) return setProgress(40)
    if (isInstanceSuccess) return setProgress(15)
  }, [isWaitSuccess, isMachineSuccess, isIpsSuccess, isInstanceSuccess])
  useEffect(() => {
    let active = true

    function increment() {
      if (!active) return
      setProgress((x) => (x >= 99 ? x : x + 1))
      const timeout = Math.random() * 2000 + 1000
      setTimeout(increment, timeout)
    }
    increment()

    return () => {
      active = false
    }
  }, [])

  const [created, setCreated] = useState(false)
  useEffect(() => {
    if (isWaitSuccess) {
      upsertNetwork({
        network: {
          blockTime: Number(params.blockTime),
          chainId: Number(params.chainId),
          name: 'Ethereum',
          rpcUrl: machine?.url,
        },
      })
      setCreated(true)
    }
  }, [isWaitSuccess])

  const { data: online } = useNetworkStatus({
    enabled: Boolean(created),
    retryDelay: 2_000,
  })

  useEffect(() => {
    if (online) {
      setOnboarded(true)
      navigate('/')
    }
  }, [online])

  return (
    <Container
      header={
        <Inset vertical='16px'>
          <Stack gap='12px'>
            <Text color='text/tertiary' size='14px'>
              Setup
            </Text>
            <Text>Deploy Node</Text>
          </Stack>
        </Inset>
      }
      footer={
        <Stack gap='16px'>
          <Box paddingTop='4px' paddingBottom='12px'>
            <Text color='text/tertiary'>Cancel setup</Text>
          </Box>
        </Stack>
      }
    >
      <Rows>
        <Row alignHorizontal='center' alignVertical='center'>
          <Stack alignHorizontal='center' gap='20px'>
            <Stack alignHorizontal='center' gap='12px'>
              <Cog size='60px' />
              <Text size='20px'>Creating deployment...</Text>
            </Stack>
            <Text color='text/tertiary'>{progress}% complete</Text>
          </Stack>
        </Row>
      </Rows>
    </Container>
  )
}
