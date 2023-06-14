import { useQuery } from '@tanstack/react-query'
import qs from 'qs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useNetworkStatus } from '../../hooks'
import { Container } from '~/components'
import { Box, Inset, Row, Rows, Stack, Text } from '~/design-system'
import { useNetwork } from '~/zustand'

export default function OnboardingDeployHosted() {
  const navigate = useNavigate()
  const { setOnboarded, upsertNetwork } = useNetwork()

  const params = qs.parse(window.location.hash.split('?')[1])

  const { data } = useQuery<any>({
    queryKey: ['deploy', params],
    queryFn: async () => {
      const res = await (
        await fetch('https://forked.network/api/instances', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        })
      ).json()
      return res
    },
  })

  const [created, setCreated] = useState(false)
  useEffect(() => {
    if (data) {
      upsertNetwork({
        network: {
          chainId: Number(params.chainId),
          name: 'Ethereum',
          rpcUrl: data.url,
        },
      })
      setCreated(true)
    }
  }, [data])

  const { data: online } = useNetworkStatus({
    enabled: Boolean(created),
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
        <Inset vertical='20px'>
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
          <Text size='20px'>Creating deployment...</Text>
        </Row>
      </Rows>
    </Container>
  )
}
