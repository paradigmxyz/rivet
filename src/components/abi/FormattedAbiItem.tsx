import type { AbiParameter } from 'abitype'
import { Fragment } from 'react'
import type { AbiItem } from 'viem'

import { Text } from '~/design-system'

export function FormattedAbiItem({
  abiItem,
  compact,
  showIndexed = true,
  showParameterNames = true,
  showType = true,
}: {
  abiItem: AbiItem
  compact?: boolean
  showIndexed?: boolean
  showParameterNames?: boolean
  showType?: boolean
}) {
  return (
    <Text family="mono" size="11px">
      {abiItem.type === 'function' && (
        <>
          {showType && <Text color="text/tertiary">function </Text>}
          {abiItem.name && <Text>{abiItem.name}</Text>}(
          {abiItem.inputs && (
            <FormattedAbiParameters
              params={abiItem.inputs}
              showNames={showParameterNames}
            />
          )}
          )
          {abiItem.stateMutability &&
            abiItem.stateMutability !== 'nonpayable' && (
              <Text> {abiItem.stateMutability} </Text>
            )}
          {abiItem.outputs?.length > 0 && (
            <>
              {' '}
              returns (
              <FormattedAbiParameters
                compact={compact}
                params={abiItem.outputs}
                showNames={showParameterNames}
              />
              )
            </>
          )}
        </>
      )}
      {abiItem.type === 'event' && (
        <>
          {showType && <Text color="text/tertiary">event </Text>}
          {abiItem.name && <Text>{abiItem.name}</Text>}(
          {abiItem.inputs && (
            <FormattedAbiParameters
              compact={compact}
              params={abiItem.inputs}
              showIndexed={showIndexed}
              showNames={showParameterNames}
            />
          )}
          )
        </>
      )}
      {abiItem.type === 'error' && (
        <>
          {showType && <Text color="text/tertiary">error </Text>}
          {abiItem.name && <Text>{abiItem.name}</Text>}((
          {abiItem.inputs && (
            <FormattedAbiParameters
              compact={compact}
              params={abiItem.inputs}
              showNames={showParameterNames}
            />
          )}
          )
        </>
      )}
      {abiItem.type === 'constructor' && (
        <>
          <Text color="text/tertiary">constructor</Text>(
          {abiItem.inputs && (
            <FormattedAbiParameters
              compact={compact}
              params={abiItem.inputs}
              showNames={showParameterNames}
            />
          )}
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
  compact,
  params,
  showIndexed,
  showNames,
}: {
  compact?: boolean
  params: readonly AbiParameter[]
  showIndexed?: boolean
  showNames?: boolean
}) {
  return (
    <Text>
      {params?.map((x, index) => (
        <Fragment key={index}>
          {index !== 0 ? `,${!compact ? ' ' : ''}` : ''}
          <ParameterType type={x.internalType || x.type} />
          {showIndexed && 'indexed' in x && x.indexed ? (
            <Text color="text/tertiary"> indexed</Text>
          ) : null}
          {showNames && <ParameterProperty index={index} name={x.name} />}
        </Fragment>
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
