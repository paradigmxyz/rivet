import type { AbiParameter } from 'abitype'
import { Fragment } from 'react'
import type { AbiItem } from 'viem'

import { Text } from '~/design-system'
import type { TextProps } from '~/design-system/components/Text'

export function FormattedAbiItem({
  abiItem,
  compact,
  showIndexed = true,
  showParameterNames = true,
  showParameters = true,
  showStateMutability = true,
  showReturns = true,
  showType = true,
  wrap = 'anywhere',
}: {
  abiItem: AbiItem
  compact?: boolean
  showIndexed?: boolean
  showParameterNames?: boolean
  showParameters?: boolean
  showStateMutability?: boolean
  showReturns?: boolean
  showType?: boolean
  wrap?: TextProps['wrap']
}) {
  return (
    <Text family="mono" size="11px" wrap={wrap}>
      {abiItem.type === 'function' && (
        <>
          {showType && <Text color="text/tertiary">function </Text>}
          {abiItem.name && <Text>{abiItem.name}</Text>}(
          {showParameters && abiItem.inputs && (
            <FormattedAbiParameters
              params={abiItem.inputs}
              showNames={showParameterNames}
            />
          )}
          )
          {showStateMutability &&
            abiItem.stateMutability &&
            abiItem.stateMutability !== 'nonpayable' && (
              <Text> {abiItem.stateMutability} </Text>
            )}
          {showReturns && abiItem.outputs?.length > 0 && (
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

export function FormattedAbiParameters({
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
          <FormattedAbiParameter
            param={x}
            showIndexed={showIndexed}
            showName={showNames}
          />
        </Fragment>
      ))}
    </Text>
  )
}

export function FormattedAbiParameter({
  param,
  showIndexed = true,
  showName = true,
  showType = true,
}: {
  param: AbiParameter
  showIndexed?: boolean
  showName?: boolean
  showType?: boolean
}) {
  const { internalType, type, name } = param
  return (
    <Text>
      {showType && <ParameterType type={internalType || type} />}
      {showIndexed && 'indexed' in param && param.indexed ? (
        <Text color="text/tertiary"> indexed</Text>
      ) : null}
      {showName && name ? ` ${name}` : ''}
    </Text>
  )
}

export function ParameterType({ type }: { type: string }) {
  const typeArray = type?.split('.').join('').split(' ')
  const type_ = typeArray?.[typeArray.length - 1]
  return <Text color="text/tertiary">{type_}</Text>
}
