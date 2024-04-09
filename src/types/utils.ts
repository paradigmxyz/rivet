/**
 * @description Combines members of an intersection into a readable type.
 *
 * @see {@link https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg}
 * @example
 * Prettify<{ a: string } & { b: string } & { c: number, d: bigint }>
 * => { a: string, b: string, c: number, d: bigint }
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

/**
 * @description Creates a type that is T with the required keys K.
 *
 * @example
 * RequiredBy<{ a?: string, b: number }, 'a'>
 * => { a: string, b: number }
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  ExactRequired<Pick<T, K>>

export type ExactRequired<type> = {
  [P in keyof type]-?: Exclude<type[P], undefined>
}

export type OneOf<
  union extends object,
  fallback extends object | undefined = undefined,
  ///
  keys extends KeyofUnion<union> = KeyofUnion<union>,
> = union extends infer Item
  ? Prettify<
      Item & {
        [_K in Exclude<keys, keyof Item>]?: fallback extends object
          ? // @ts-ignore
            fallback[_K]
          : undefined
      }
    >
  : never
type KeyofUnion<type> = type extends type ? keyof type : never

/**
 * @description Construct a type with the properties of union type T except for those in type K.
 * @example
 * type Result = UnionOmit<{ a: string, b: number } | { a: string, b: undefined, c: number }, 'a'>
 * => { b: number } | { b: undefined, c: number }
 */
export type UnionOmit<type, keys extends keyof type> = type extends any
  ? Omit<type, keys>
  : never
