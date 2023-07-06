import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { OnboardingContainer } from '~/components'
import { Box, SFSymbol, Stack, Text } from '~/design-system'
import { useNetworkStatus } from '~/hooks/useNetworkStatus'
import { useNetworkStore } from '~/zustand'

export default function OnboardingRun() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setOnboarded } = useNetworkStore()

  const command = useMemo(() => {
    let command = 'anvil \\\n'
    if (params.get('chainId'))
      command += `--chain-id ${params.get('chainId')} \\\n`
    if (params.get('forkBlockNumber'))
      command += `--fork-block-number ${params.get('forkBlockNumber')} \\\n`
    if (params.get('forkUrl'))
      command += `--fork-url ${params.get('forkUrl')} \\\n`
    if (params.get('port') !== '8545')
      command += `--port ${params.get('port')} \\\n`
    if (!params.get('autoMine')) command += '--no-mining \\\n'
    if (params.get('blockBaseFeePerGas'))
      command += `--block-base-fee-per-gas ${params.get(
        'blockBaseFeePerGas',
      )} \\\n`
    if (params.get('blockTime'))
      command += `--block-time ${params.get('blockTime')} \\\n`
    if (params.get('gasLimit'))
      command += `--gas-limit ${params.get('gasLimit')} \\\n`
    if (params.get('gasPrice'))
      command += `--gas-price ${params.get('gasPrice')} \\\n`
    return command.replace(/ \\\n$/, '')
  }, [])

  const { data: online } = useNetworkStatus({
    refetchInterval: 2_000,
  })

  useEffect(() => {
    if (online) {
      setOnboarded(true)
      navigate('/')
    }
  }, [online])

  return (
    <OnboardingContainer title='Run Anvil'>
      <Stack gap='20px'>
        <Text color='text/secondary' size='14px'>
          Run the following command in your CLI to start a local chain with your
          configuration:
        </Text>
        <Box
          as='pre'
          alignItems='center'
          backgroundColor='surface/fill/tertiary'
          display='flex'
          paddingVertical='16px'
          paddingLeft='12px'
          paddingRight='12px'
          position='relative'
          // @ts-expect-error
          style={{ textWrap: 'wrap' }}
        >
          <Text as='code' size='12px'>
            {command}
          </Text>
          {/* TODO: Extract into `IconButton` */}
          <Box
            as='button'
            alignItems='center'
            display='flex'
            backgroundColor={{
              hover: 'surface/fill/secondary',
            }}
            borderRadius='3px'
            onClick={() => navigator.clipboard.writeText(command)}
            justifyContent='center'
            position='absolute'
            top='4px'
            right='4px'
            style={{ width: '24px', height: '24px' }}
            transform={{ hoveractive: 'shrink95' }}
          >
            <SFSymbol symbol='doc.on.doc' size='16px' />
          </Box>
        </Box>
        <Text color='text/secondary' size='14px'>
          When Rivet detects the Anvil instance is running, we will redirect
          you.
        </Text>
      </Stack>
    </OnboardingContainer>
  )
}
