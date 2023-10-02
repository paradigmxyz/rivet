import { createContext, useContext } from 'react'

export type AppMeta = {
  type: 'embedded' | 'standalone'
}

export const AppMetaContext = createContext<AppMeta>({ type: 'standalone' })

export function useAppMeta() {
  return useContext(AppMetaContext)
}
