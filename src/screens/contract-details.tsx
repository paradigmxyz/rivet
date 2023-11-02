import * as Tabs from '@radix-ui/react-tabs'
import type { AbiFunction } from 'abitype'
import { useMemo } from 'react'
import { useParams } from 'react-router'

import {
  AbiFunctionsAccordion,
  Container,
  LabelledContent,
  TabsContent,
  TabsList,
} from '~/components'
import { Bleed, Box, Stack, Text } from '~/design-system'
import { useAutoloadAbi } from '~/hooks/useAutoloadAbi'
import { useContracts } from '~/hooks/useContracts'

export default function ContractDetails() {
  const { contractAddress } = useParams()
  const { contracts } = useContracts({ enabled: false })
  const contract = contracts.find((c) => c.address === contractAddress)

  const {
    data: abi,
    isLoading,
    isFetched,
  } = useAutoloadAbi({
    address: contract?.address,
    enabled: Boolean(contract?.address),
  })

  const abiFunctions = useMemo(() => {
    if (!abi) return undefined
    return abi
      .filter((abiItem) => abiItem.type === 'function')
      .map((abiItem) => ({
        ...abiItem,
        inputs: (abiItem as {} as AbiFunction).inputs || [],
        outputs: (abiItem as {} as AbiFunction).outputs || [],
      })) as {} as AbiFunction[]
  }, [abi])

  const hasStateMutability = !abiFunctions?.some(
    (abiItem) => !('stateMutability' in abiItem),
  )

  const [readAbi, writeAbi] = useMemo(() => {
    if (!abiFunctions) return [undefined, undefined]
    if (!hasStateMutability) return [undefined, undefined]
    const read = abiFunctions.filter(
      (abiItem) =>
        'stateMutability' in abiItem &&
        (abiItem.stateMutability === 'pure' ||
          abiItem.stateMutability === 'view'),
    )
    const write = abiFunctions.filter(
      (abiItem) =>
        'stateMutability' in abiItem &&
        (abiItem.stateMutability === 'nonpayable' ||
          abiItem.stateMutability === 'payable'),
    )
    return [read as {} as AbiFunction[], write as {} as AbiFunction[]]
  }, [abiFunctions, hasStateMutability])

  return (
    <Container dismissable header="Contract Details">
      <Stack gap="20px">
        <Box>
          <LabelledContent label="Contract Address">
            <Text size="12px">{contract?.address}</Text>
          </LabelledContent>
        </Box>
        {isLoading && (
          <Text color="text/tertiary" size="12px">
            Loading...
          </Text>
        )}
        {isFetched && (
          <Tabs.Root asChild defaultValue="read">
            <Box display="flex" flexDirection="column" height="full">
              {hasStateMutability ? (
                <>
                  <TabsList
                    items={[
                      { label: 'Read', value: 'read' },
                      { label: 'Write', value: 'write' },
                    ]}
                  />
                  <TabsContent value="read">
                    <Bleed horizontal="-8px">
                      {contract?.address && readAbi && (
                        <AbiFunctionsAccordion
                          abi={readAbi}
                          address={contract?.address}
                        />
                      )}
                    </Bleed>
                  </TabsContent>
                  <TabsContent value="write">
                    <Bleed horizontal="-8px">
                      {contract?.address && writeAbi && (
                        <AbiFunctionsAccordion
                          abi={writeAbi}
                          address={contract?.address}
                        />
                      )}
                    </Bleed>
                  </TabsContent>
                </>
              ) : (
                <>
                  {contract?.address && abiFunctions && (
                    <Bleed horizontal="-8px">
                      <AbiFunctionsAccordion
                        abi={abiFunctions}
                        address={contract?.address}
                      />
                    </Bleed>
                  )}
                </>
              )}
            </Box>
          </Tabs.Root>
        )}
      </Stack>
    </Container>
  )
}
