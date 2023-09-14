// TODO: rewrite abi-guesser in viem
import { guessFragment } from '@openchainxyz/abi-guesser'
import { FunctionFragment } from 'ethers'
import { useMemo } from 'react'
import type { Abi, Hex } from 'viem'

export function useCalldataAbi({ data }: { data?: Hex; enabled?: boolean }) {
  return useMemo(() => {
    if (!data) return null
    try {
      const abiItem = JSON.parse(
        FunctionFragment.from(guessFragment(data)).format('json'),
      )
      return [
        { ...abiItem, name: `0x${abiItem.name.replace('guessed_', '')}` },
      ] as Abi
    } catch {}
  }, [data])
}
