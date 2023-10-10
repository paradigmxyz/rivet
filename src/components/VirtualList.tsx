import {
  type VirtualItem,
  defaultRangeExtractor,
  useVirtualizer,
} from '@tanstack/react-virtual'
import { type ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { Link as RRLink } from 'react-router-dom'

import { Box } from '~/design-system'
import { deepEqual } from '~/utils'
import { useScrollPositionStore } from '~/zustand'

export type VirtualLayoutItem = {
  index?: number
  size: number
  sticky?: boolean
  type: 'header' | 'empty' | 'loading' | 'item' | 'search' | 'load-more'
}
export type VirtualLayout = readonly (VirtualLayoutItem | undefined)[]

export function useVirtualList({ layout: layout_ }: { layout: VirtualLayout }) {
  const layout = useMemo(() => layout_.filter(Boolean), [layout_])

  const getLayoutItem = useCallback((index: number) => layout[index], [layout])

  const wrapperRef = useRef<HTMLDivElement>(null)
  const activeStickyIndexes = useRef<number[]>([])
  const virtualizer = useVirtualizer({
    count: layout.length,
    getScrollElement: () => wrapperRef!.current,
    estimateSize: (index) => layout[index]!.size,
    rangeExtractor: useCallback(
      (range: any) => {
        const indexes: number[] = []
        for (let i = 0; i < layout.length; i++) {
          if (layout[i].sticky) {
            if (range.startIndex >= i) indexes.push(i)
            else if (layout[i - 1].sticky) indexes.push(i)
          }
        }

        if (!deepEqual(activeStickyIndexes, indexes))
          activeStickyIndexes.current = indexes

        return Array.from(
          new Set(
            [...indexes, ...defaultRangeExtractor(range)].filter(
              (x) => typeof x === 'number',
            ) as number[],
          ),
        )
      },
      [layout],
    ),
  })

  const { position, setPosition } = useScrollPositionStore()
  useEffect(() => {
    wrapperRef.current!.scrollTo({ top: position })
  }, [position])

  ////////////////////////////////////////////////////////////////
  // List Wrapper

  type WrapperProps = Parameters<typeof Box>[0] & {
    children: ReactNode
  }
  const Wrapper = useCallback(
    ({ children, ...props }: WrapperProps) => (
      <Box
        ref={wrapperRef}
        {...props}
        style={{ height: '100%', overflowY: 'scroll', overflowX: 'hidden' }}
      >
        {children}
      </Box>
    ),
    [],
  )

  ////////////////////////////////////////////////////////////////
  // List

  type ListProps = {
    children: ({
      getLayoutItem,
      items,
    }: {
      getLayoutItem: (index: number) => VirtualLayoutItem
      items: VirtualItem[]
    }) => ReactNode[]
  }
  const List = useCallback(
    ({ children }: ListProps) => (
      <Box
        position="relative"
        width="full"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {children({ getLayoutItem, items: virtualizer.getVirtualItems() })}
      </Box>
    ),
    [getLayoutItem, virtualizer],
  )

  ////////////////////////////////////////////////////////////////
  // List Item

  type ItemProps = {
    children: ReactNode
    index: number
    size: number
    start: number
  }
  const Item = useCallback(
    ({ children, index, size, start }: ItemProps) => {
      const stickyIndex = activeStickyIndexes?.current.indexOf(index) ?? -1
      const sticky = getLayoutItem(index).sticky
        ? stickyIndex >= 0
          ? 'active'
          : 'idle'
        : undefined
      return (
        <Box
          backgroundColor={sticky ? 'surface/secondary' : undefined}
          position={sticky === 'active' ? 'sticky' : 'absolute'}
          top="0px"
          left="0px"
          width="full"
          style={{
            height: `${size}px`,
            transform:
              sticky !== 'active' ? `translateY(${start}px)` : undefined,
            zIndex: sticky ? 1 : undefined,
            top: sticky === 'active' ? stickyIndex * 40 : 0,
          }}
        >
          {children}
        </Box>
      )
    },
    [getLayoutItem],
  )

  ////////////////////////////////////////////////////////////////
  // List Link

  type LinkProps = {
    children: ReactNode
    to: string
  }
  const Link = useCallback(
    ({ children, to }: LinkProps) => (
      <RRLink
        onClick={() => setPosition(wrapperRef.current?.scrollTop!)}
        to={to}
      >
        {children}
      </RRLink>
    ),
    [setPosition],
  )

  ////////////////////////////////////////////////////////////////

  return useMemo(
    () => Object.assign(List, { Item, Link, Wrapper }),
    [Item, Link, List, Wrapper],
  )
}
