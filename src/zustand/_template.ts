import { useStore } from 'zustand'

import { createStore } from './utils'

export type TemplateState = {
  foo?: string
}
export type TemplateActions = {
  setFoo: (foo?: string) => void
}
export type TemplateStore = TemplateState & TemplateActions

export const templateStore = createStore<TemplateStore>(
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
