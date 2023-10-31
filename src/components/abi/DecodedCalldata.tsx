import type { AbiFunction } from 'abitype'
import { type ReactNode, useMemo } from 'react'
import {
  type Abi,
  type AbiItem,
  type Address,
  type Hex,
  decodeAbiParameters,
  getAbiItem as getAbiItem_viem,
  parseAbiItem,
  slice,
} from 'viem'

import { LabelledContent } from '~/components'
import { Bleed, Box, Separator, Stack, Text } from '~/design-system'
import { useAutoloadAbi } from '~/hooks/useAutoloadAbi'
import { useCalldataAbi } from '~/hooks/useCalldataAbi'
import { useLookupSignature } from '~/hooks/useLookupSignature'

import { DecodedAbiParameters } from './DecodedAbiParameters'
import { FormattedAbiItem } from './FormattedAbiItem'

export function DecodedCalldata({
  address,
  data,
  labelRight,
}: { address?: Address | null; data: Hex; labelRight?: ReactNode }) {
  const selector = slice(data, 0, 4)

  // Try extract ABI from whatsabi autoloading (etherscan, 4byte dbs, etc)
  const { data: autoloadAbi } = useAutoloadAbi({
    address,
    enabled: data && data !== '0x',
  })

  const { data: signature, isFetched } = useLookupSignature({
    selector,
  })
  const signatureAbi = useMemo(() => {
    if (!signature) return
    return [parseAbiItem(`function ${signature}`) as AbiFunction] as const
  }, [signature])

  // If extraction fails, fall back to guessing ABI from calldata.
  const calldataAbi = useCalldataAbi({
    data,
  })

  const [abiItem, isGuess] = useMemo(() => {
    const autoloadAbiItem =
      autoloadAbi &&
      (getAbiItem({
        abi: autoloadAbi as unknown as Abi,
        selector,
      }) as AbiFunction)
    const signatureAbiItem =
      signatureAbi &&
      (getAbiItem({ abi: signatureAbi, selector }) as AbiFunction)
    const calldataAbiItem =
      calldataAbi && (getAbiItem({ abi: calldataAbi, selector }) as AbiFunction)

    if (autoloadAbiItem) {
      if (
        (signatureAbiItem?.inputs?.length || 0) >
        (autoloadAbiItem?.inputs?.length || 0)
      )
        return [signatureAbiItem, false]
      if (
        (calldataAbiItem?.inputs?.length || 0) >
        (autoloadAbiItem?.inputs?.length || 0)
      )
        return [calldataAbiItem, true]
      return [autoloadAbiItem, false]
    }
    if (signatureAbiItem) return [signatureAbiItem, false]
    return [calldataAbiItem, true]
  }, [autoloadAbi, signatureAbi, calldataAbi, selector])

  const rawArgs = abiItem && data.length > 10 ? slice(data, 4) : undefined
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
  }, [abiItem, rawArgs])

  return (
    <Stack gap="20px">
      {!isFetched && (
        <Text color="text/tertiary" size="12px">
          Loading...
        </Text>
      )}
      {isFetched && abiItem && (
        <>
          {isGuess && (
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
      <LabelledContent label="Raw Data" labelRight={labelRight}>
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
