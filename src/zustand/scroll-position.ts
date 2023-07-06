import { useSyncExternalStore } from 'react'

import { createStore } from './utils'

export type ScrollPositionState = {
  position?: number
}
export type ScrollPositionActions = {
  setPosition: (foo: number) => void
}
export type ScrollPositionStore = ScrollPositionState & ScrollPositionActions

export const scrollPositionStore = createStore<ScrollPositionStore>((set) => ({
  position: 0,
  setPosition(position) {
    set({ position })
  },
}))

export const useScrollPositionStore = () =>
  useSyncExternalStore(
    scrollPositionStore.subscribe,
    scrollPositionStore.getState,
  )
