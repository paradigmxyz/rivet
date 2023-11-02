import type { AbiParameter } from 'abitype'

export function normalizeAbiParametersValues({
  params,
  values,
}: { params: readonly AbiParameter[]; values: Record<string, unknown> }) {
  const normalizedValues = []
  for (let i = 0; i < params.length; i++) {
    const param = params[i]
    const value = values[param.name || i.toString()]
    const normalizedValue = normalize({ param, value })
    normalizedValues.push(normalizedValue)
  }
  return normalizedValues
}

function normalize({
  param,
  value: value_,
}: { param: AbiParameter; value: unknown }): unknown {
  const value = getInputValue(value_)

  if (Array.isArray(value)) {
    const childType = param.type.replace(/\[\d*\]$/, '')
    return value.map((v) =>
      normalize({
        param: {
          ...param,
          type: childType,
        },
        value: v,
      }),
    )
  }

  if (typeof value === 'object' && value !== null && 'components' in param) {
    const components = param.components ?? []
    const hasUnnamedChild =
      components.length === 0 || components.some(({ name }) => !name)

    const normalizedValue: any = hasUnnamedChild ? [] : {}
    for (let i = 0; i < components.length; i++) {
      const param = components[i]
      const value_ = (value as any)[param.name ?? i.toString()]
      normalizedValue[hasUnnamedChild ? i : param.name!] = normalize({
        param,
        value: value_,
      })
    }
    return normalizedValue
  }

  if (typeof value === 'string') return normalizePrimitive({ param, value })

  throw new Error('Unknown param + value to normalize.')
}

function normalizePrimitive({
  param,
  value,
}: { param: AbiParameter; value: string }) {
  if (param.type === 'bool') return JSON.parse(value)
  if (param.type.startsWith('uint') || param.type.startsWith('int'))
    return BigInt(value)
  return value
}

function getInputValue(value: unknown) {
  return value &&
    typeof value === 'object' &&
    '_value' in value &&
    value._value !== ''
    ? value._value
    : value
}
