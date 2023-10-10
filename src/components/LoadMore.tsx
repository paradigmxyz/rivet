import type { UseInfiniteQueryResult } from '@tanstack/react-query'
import { type ReactNode, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { Box } from '~/design-system'

export function LoadMore({
  children,
  query,
}: { children: ReactNode; query: UseInfiniteQueryResult }) {
  const { fetchNextPage, isFetching, isFetchingNextPage } = query

  const { ref, inView } = useInView()
  useEffect(() => {
    if (isFetching) return
    if (isFetchingNextPage) return
    if (inView) fetchNextPage()
  }, [fetchNextPage, inView, isFetching, isFetchingNextPage])

  return <Box ref={ref}>{(isFetching || isFetchingNextPage) && children}</Box>
}
