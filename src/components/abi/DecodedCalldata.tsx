import { useMemo } from 'react'
import {
  type Abi,
  type AbiItem,
  type Address,
  type Hex,
  decodeAbiParameters,
  getAbiItem as getAbiItem_viem,
  slice,
} from 'viem'

import { LabelledContent } from '~/components'
import { Bleed, Box, Separator, Stack, Text } from '~/design-system'
import { useAutoloadAbi } from '~/hooks/useAutoloadAbi'
import { useCalldataAbi } from '~/hooks/useCalldataAbi'

import { DecodedAbiParameters } from './DecodedAbiParameters'
import { FormattedAbiItem } from './FormattedAbiItem'

export function DecodedCalldata({
  address,
  data,
}: { address?: Address; data: Hex }) {
  // Try extract ABI from whatsabi autoloading (etherscan, 4byte dbs, etc)
  const { data: autoloadAbi, isLoading } = useAutoloadAbi({
    address,
    enabled: Boolean(data),
  })

  // If extraction fails, fall back to guessing ABI from calldata.
  const calldataAbi = useCalldataAbi({
    data,
  })

  const abi = autoloadAbi || calldataAbi

  const selector = abi ? slice(data, 0, 4) : undefined
  const rawArgs = abi && data.length > 10 ? slice(data, 4) : undefined

  const autoloadAbiItem = useMemo(() => {
    if (!autoloadAbi) return
    if (!selector) return
    return getAbiItem({ abi: autoloadAbi as unknown as Abi, selector })
  }, [autoloadAbi, selector])
  const calldataAbiItem = useMemo(() => {
    if (!calldataAbi) return
    if (!selector) return
    return getAbiItem({ abi: calldataAbi, selector })
  }, [calldataAbi, selector])

  const abiItem = autoloadAbiItem || calldataAbiItem

  const { args } = useMemo(() => {
    if (abiItem && rawArgs && 'name' in abiItem && 'inputs' in abiItem) {
      try {
        return {
          functionName: abiItem?.name,
          args: decodeAbiParameters(abiItem?.inputs, rawArgs),
        }
      } catch {}
    }
    return { args: undefined, functionName: undefined }
  }, [abi, rawArgs])

  return (
    <Stack gap="20px">
      {isLoading && <Text size="12px">Loading...</Text>}
      {abiItem && !isLoading && (
        <>
          {calldataAbiItem && !autoloadAbiItem && (
            <Box backgroundColor="surface/yellowTint" padding="8px">
              <Text size="11px">
                Warning: We could not accurately extract function parameters for
                this transaction. This is a best guess based on the calldata. It
                may be incorrect.
              </Text>
            </Box>
          )}
          <LabelledContent label="Function">
            <Box
              backgroundColor="surface/primary"
              paddingHorizontal="8px"
              paddingVertical="12px"
            >
              <FormattedAbiItem abiItem={abiItem} />
            </Box>
          </LabelledContent>
          {(args || []).length > 0 && (
            <LabelledContent label="Arguments">
              <Bleed horizontal="-12px">
                <DecodedAbiParameters
                  params={abiItem?.type === 'function' ? abiItem.inputs : []}
                  args={args || []}
                />
              </Bleed>
            </LabelledContent>
          )}
        </>
      )}
      {abiItem && <Separator />}
      <LabelledContent label="Raw Data">
        <Box
          backgroundColor="surface/primary"
          paddingHorizontal="8px"
          paddingVertical="12px"
        >
          {selector && rawArgs ? (
            <Text family="mono" size="11px">
              <Text color="text/tertiary">{selector}</Text>
              {rawArgs.replace('0x', '')}
            </Text>
          ) : (
            <Text family="mono" size="11px">
              {data}
            </Text>
          )}
        </Box>
      </LabelledContent>
    </Stack>
  )
}

function getAbiItem({ abi, selector }: { abi: Abi; selector: Hex }) {
  const abiItem =
    (getAbiItem_viem({ abi, name: selector }) as AbiItem) ||
    abi.find((x: any) => x.name === selector) ||
    abi.find((x: any) => x.selector === selector)
  if (!abiItem) return
  return {
    outputs: [],
    inputs: [],
    ...abiItem,
    // @ts-expect-error
    name: abiItem?.name || abiItem?.selector,
  } as AbiItem
}
