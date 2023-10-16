import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'
import { createStore } from './utils'

export type SettingsState = {
  bypassConnectAuth?: boolean
  bypassSignatureAuth?: boolean
  bypassTransactionAuth?: boolean
}
export type SettingsActions = {
  setBypassConnectAuth: (value?: boolean) => void
  setBypassSignatureAuth: (value?: boolean) => void
  setBypassTransactionAuth: (value?: boolean) => void
}
export type SettingsStore = SettingsState & SettingsActions

export const settingsStore = createStore<SettingsStore>(
  (set) => ({
    bypassConnectAuth: false,
    bypassSignatureAuth: false,
    bypassTransactionAuth: false,
    setBypassConnectAuth(value) {
      set({ bypassConnectAuth: value })
    },
    setBypassSignatureAuth(value) {
      set({ bypassSignatureAuth: value })
    },
    setBypassTransactionAuth(value) {
      set({ bypassTransactionAuth: value })
    },
  }),
  {
    persist: {
      name: 'settings',
      version: 0,
    },
  },
)

export const useSettingsStore = () =>
  useSyncExternalStoreWithTracked(
    settingsStore.subscribe,
    settingsStore.getState,
  )
