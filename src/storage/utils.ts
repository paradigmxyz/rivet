export function replacer(_: string, value: unknown) {
  if (typeof value === 'bigint') return `#bigint.${value.toString()}`
  return value
}

export function reviver(_: string, value: unknown) {
  if (typeof value === 'string' && value.startsWith('#bigint.'))
    return BigInt(value.replace('#bigint.', ''))
  return value
}
