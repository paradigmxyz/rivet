import type { RpcRequest } from 'viem/utils'

import { BaseError } from './base.js'

export type ProviderRpcErrorCode =
  | -1 // Unknown
  | 4001 // User Rejected Request
  | 4100 // Unauthorized
  | 4200 // Unsupported Method
  | 4900 // Disconnected
  | 4901 // Chain Disconnected
  | 4902 // Chain Not Recongnized

type ProviderRpcErrorOptions = {
  code: ProviderRpcErrorCode
  details?: string
  metaMessages?: string[]
  shortMessage: string
}

type RpcError<T = unknown> = {
  code: number
  message: string
  data?: T
}

/**
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 *
 * - EIP https://eips.ethereum.org/EIPS/eip-1193
 */
export class ProviderRpcError<TData = unknown> extends BaseError {
  name = 'ProviderRpcError'

  code: ProviderRpcErrorCode
  data?: TData

  constructor(
    error: RpcError<TData>,
    { code, details, metaMessages, shortMessage }: ProviderRpcErrorOptions,
  ) {
    super(shortMessage, {
      details: details || error.message,
      metaMessages,
    })
    this.code = code
    this.data = error.data
  }
}

/**
 * Subclass for a "User Rejected Request" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export class UserRejectedRequestError extends ProviderRpcError {
  static code = 4001 as const
  static message = 'The user rejected the request.' as const

  override name = 'UserRejectedRequestError'

  request?: RpcRequest

  constructor(error: RpcError<{ request: RpcRequest }>) {
    const request = error.data?.request

    super(error, {
      code: UserRejectedRequestError.code,
      metaMessages: request
        ? [
            `Method: ${request.method}`,
            ...(request.params
              ? ['Params:', prettyPrint(request.params[0] || {})]
              : []),
          ]
        : undefined,
      shortMessage: UserRejectedRequestError.message,
    })

    this.request = error.data?.request
  }
}

/**
 * Subclass for an "Unauthorized" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export class UnauthorizedProviderError extends ProviderRpcError {
  static code = 4100

  override name = 'UnauthorizedProviderError'

  constructor(error: RpcError) {
    super(error, {
      code: 4100,
      shortMessage:
        'The requested method and/or account has not been authorized by the user.',
    })
  }
}

/**
 * Subclass for an "Unsupported Method" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export class UnsupportedProviderMethodError extends ProviderRpcError {
  static code = 4200

  override name = 'UnsupportedProviderMethodError'

  constructor(error: RpcError) {
    super(error, {
      code: 4200,
      shortMessage: 'The Provider does not support the requested method.',
    })
  }
}

/**
 * Subclass for an "Disconnected" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export class ProviderDisconnectedError extends ProviderRpcError {
  static code = 4900

  override name = 'ProviderDisconnectedError'

  constructor(error: RpcError) {
    super(error, {
      code: 4900,
      shortMessage: 'The Provider is disconnected from all chains.',
    })
  }
}

/**
 * Subclass for an "Chain Disconnected" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export class ChainDisconnectedError extends ProviderRpcError {
  static code = 4901

  override name = 'ChainDisconnectedError'

  constructor(error: RpcError) {
    super(error, {
      code: 4901,
      shortMessage: 'The Provider is not connected to the requested chain.',
    })
  }
}

/**
 * Subclass for an "Switch Chain" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export class SwitchChainError extends ProviderRpcError {
  static code = 4902

  override name = 'SwitchChainError'

  constructor(error: RpcError) {
    super(error, {
      code: 4902,
      shortMessage: 'An error occurred when attempting to switch chain.',
    })
  }
}

/**
 * Subclass for an unknown RPC error.
 */
export class UnknownRpcError extends ProviderRpcError {
  static code = -1

  override name = 'UnknownRpcError'

  constructor(error: RpcError) {
    super(error, {
      code: -1,
      shortMessage: 'An unknown RPC error occurred.',
    })
  }
}

function prettyPrint(
  args: Record<string, bigint | number | string | undefined | false | unknown>,
) {
  const entries = Object.entries(args)
    .map(([key, value]) => {
      if (value === undefined || value === false) return null
      return [key, value]
    })
    .filter(Boolean) as [string, string][]
  const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0)
  return entries
    .map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`)
    .join('\n')
}
