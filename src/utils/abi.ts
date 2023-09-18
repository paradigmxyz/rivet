// TODO: rewrite abi-guesser in viem
import { guessFragment } from '@openchainxyz/abi-guesser'
import { FunctionFragment } from 'ethers'
import type { AbiItem, Hex } from 'viem'

export function guessAbiItem(data: Hex) {
  return JSON.parse(
    FunctionFragment.from(guessFragment(data)).format('json'),
  ) as AbiItem
}
