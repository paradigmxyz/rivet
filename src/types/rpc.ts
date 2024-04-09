import type { EIP1193Parameters, EIP1474Methods } from 'viem'

type SuccessResult<T> = {
  method?: never | undefined
  result: T
  error?: never | undefined
}
type ErrorResult<T> = {
  method?: never | undefined
  result?: never | undefined
  error: T
}
type Subscription<TResult, TError> = {
  method: 'eth_subscription'
  error?: never | undefined
  result?: never | undefined
  params: {
    subscription: string
  } & (
    | {
        result: TResult
        error?: never | undefined
      }
    | {
        result?: never | undefined
        error: TError
      }
  )
}
export type RpcResponse<TResult = any, TError = any> = {
  jsonrpc: `${number}`
  id: number
} & (
  | SuccessResult<TResult>
  | ErrorResult<TError>
  | Subscription<TResult, TError>
)

export type RpcRequest = EIP1193Parameters<EIP1474Methods> & { id: number }
