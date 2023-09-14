import type { AbiParameter } from 'abitype'
import type { AbiItem } from 'viem'

import { Text } from '~/design-system'

export function FormattedAbiItem({ abiItem }: { abiItem: AbiItem }) {
  return (
    <Text family="mono" size="11px">
      {abiItem.type === 'function' && (
        <>
          <Text color="text/tertiary">function </Text>
          {abiItem.name && <Text>{abiItem.name}</Text>}(
          {abiItem.inputs && <FormattedAbiParameters params={abiItem.inputs} />}
          )
          {abiItem.stateMutability &&
            abiItem.stateMutability !== 'nonpayable' && (
              <Text> {abiItem.stateMutability} </Text>
            )}
          {abiItem.outputs?.length > 0 && (
            <>
              {' '}
              returns (
              <FormattedAbiParameters params={abiItem.outputs} />)
            </>
          )}
        </>
      )}
      {abiItem.type === 'event' && (
        <>
          <Text color="text/tertiary">event </Text>
          {abiItem.name && <Text>{abiItem.name}</Text>}(
          {abiItem.inputs && <FormattedAbiParameters params={abiItem.inputs} />}
          )
        </>
      )}
      {abiItem.type === 'error' && (
        <>
          <Text color="text/tertiary">error </Text>
          {abiItem.name && <Text>{abiItem.name}</Text>}((
          {abiItem.inputs && <FormattedAbiParameters params={abiItem.inputs} />}
          )
        </>
      )}
      {abiItem.type === 'constructor' && (
        <>
          <Text color="text/tertiary">constructor</Text>(
          {abiItem.inputs && <FormattedAbiParameters params={abiItem.inputs} />}
          ){abiItem.stateMutability === 'payable' && <Text> payable</Text>}
        </>
      )}
      {abiItem.type === 'fallback' && (
        <>
          <Text color="text/tertiary">fallback</Text>()
        </>
      )}
      {abiItem.type === 'receive' && (
        <>
          <Text color="text/tertiary">receive</Text>() external payable
        </>
      )}
    </Text>
  )
}

////////////////////////////////////////////////////////////////////////

function FormattedAbiParameters({
  params,
}: {
  params: readonly AbiParameter[]
}) {
  return (
    <Text>
      {params?.map((x, index) => (
        <>
          {index !== 0 ? ', ' : ''}
          <ParameterType type={x.internalType || x.type} />
          <ParameterProperty index={index} name={x.name} />
        </>
      ))}
    </Text>
  )
}

function ParameterType({ type }: { type: string }) {
  const typeArray = type?.split('.').join('').split(' ')
  const type_ = typeArray?.[typeArray.length - 1]
  return <Text color="text/tertiary">{type_}</Text>
}

function ParameterProperty({
  index,
  name,
}: {
  index: number
  name?: string
}) {
  return <Text> {name || index.toString()}</Text>
}
