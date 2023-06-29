import { useEffect, useRef } from 'react'

export function usePrevious<T>(newValue: T) {
  const previousRef = useRef<T>()

  // rome-ignore lint/nursery/useExhaustiveDependencies:
  useEffect(() => {
    previousRef.current = newValue
  })

  return previousRef.current
}
