// TODO: rewrite abi-guesser in viem
import { guessFragment } from '@openchainxyz/abi-guesser'
import type { AbiEvent } from 'abitype'
import { FunctionFragment } from 'ethers'
import {
  type AbiItem,
  type ContractEventName,
  type DecodeEventLogParameters,
  type Hex,
  decodeEventLog,
} from 'viem'

export function decodeEventLogs_guessed<
  const TAbiEvent extends AbiEvent,
  TTopics extends Hex[] = Hex[],
  TData extends Hex | undefined = undefined,
>({
  abiItem,
  data,
  topics,
}: { abiItem: AbiEvent } & Pick<
  DecodeEventLogParameters<
    [TAbiEvent],
    ContractEventName<[TAbiEvent]>,
    TTopics,
    TData,
    true
  >,
  'data' | 'topics'
>) {
  const indexedValues = topics.slice(1)

  for (let i = 0; i < indexedValues.length; i++) {
    const offset = indexedValues.length - i
    for (
      let j = 0;
      j < abiItem.inputs.length - indexedValues.length + 1 - i;
      j++
    ) {
      const inputs = abiItem.inputs.map((input, index) => ({
        ...input,
        indexed:
          index < offset - 1 ||
          index === i + j + offset - 1 ||
          index >= abiItem.inputs.length - (indexedValues.length - offset),
      }))
      const abi = [{ ...abiItem, inputs }]
      try {
        return decodeEventLog({
          abi,
          topics,
          data,
        })
      } catch {}
    }
  }
}

export function guessAbiItem(data: Hex) {
  return JSON.parse(
    FunctionFragment.from(guessFragment(data)).format('json'),
  ) as AbiItem
}
