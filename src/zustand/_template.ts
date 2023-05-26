import { useStore } from 'zustand'

import { createStore } from './utils'

type TemplateState = {
  foo?: string
  setFoo: (foo?: string) => void
}

export const templateStore = createStore<TemplateState>(
  (set) => ({
    foo: undefined,
    setFoo(foo) {
      set({ foo })
    },
  }),
  {
    persist: {
      name: 'foo',
      version: 0,
    },
  },
)

export const useTemplateState = () => useStore(templateStore)
