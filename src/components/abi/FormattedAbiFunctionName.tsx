import { useMemo } from 'react'
import { type Hex, parseAbiItem, slice } from 'viem'

import { Text } from '~/design-system'
import { useLookupSignature } from '../../hooks/useLookupSignature'

import { FormattedAbiItem } from './FormattedAbiItem'

export function FormattedAbiFunctionName({ data }: { data: Hex }) {
  const selector = slice(data, 0, 4)
  const { data: signature } = useLookupSignature({
    selector,
  })

  const abiItem = useMemo(() => {
    if (!signature) return
    const abiItem = parseAbiItem(`function ${signature}`)
    if (abiItem.type !== 'function') return
    return abiItem
  }, [signature])

  return (
    <Text family="mono" size="11px" wrap={false}>
      {abiItem ? (
        <FormattedAbiItem
          abiItem={abiItem}
          compact
          showIndexed={false}
          showParameters={false}
          showType={false}
        />
      ) : (
        selector
      )}
    </Text>
  )
}
