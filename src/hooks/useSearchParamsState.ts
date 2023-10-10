import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

type UseSearchParamsStateReturnType<value> = readonly [
  state: value,
  setState: (newState: value) => void,
]

export function useSearchParamsState<value>(
  name: string,
  defaultValue: value,
): UseSearchParamsStateReturnType<value> {
  const [searchParams, setSearchParams] = useSearchParams()

  const state = useMemo(() => {
    const searchParam = searchParams.get(name)
    if (!searchParam) return defaultValue
    try {
      return JSON.parse(searchParam)
    } catch {
      return typeof searchParam === 'string' ? searchParam : defaultValue
    }
  }, [defaultValue, name, searchParams])

  const setState = (newState: string) => {
    setSearchParams({
      ...[...searchParams.entries()].reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value,
        }),
        {},
      ),
      [name]:
        typeof newState !== 'string' ? JSON.stringify(newState) : newState,
    })
  }

  return [state, setState] as UseSearchParamsStateReturnType<value>
}
