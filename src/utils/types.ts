export type UnionOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
