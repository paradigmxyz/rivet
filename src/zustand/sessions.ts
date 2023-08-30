import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'

import { createStore } from './utils'

type Host = string
type Session = { host: Host }

export type SessionsState = {
  sessions: Session[]
}
export type SessionsActions = {
  addSession: ({ session }: { session: Session }) => void
  getSession: ({ host }: { host: Host }) => Session | undefined
  removeSession: ({ host }: { host: Host }) => void
}
export type SessionsStore = SessionsState & SessionsActions

export const sessionsStore = createStore<SessionsStore>(
  (set, get) => ({
    sessions: [],
    addSession({ session }) {
      if (get().sessions.find((s) => s.host === session.host)) return
      set((state) => ({
        ...state,
        sessions: [...state.sessions, session],
      }))
    },
    getSession({ host }) {
      return get().sessions.find((session) => session.host === host)
    },
    removeSession({ host }) {
      set((state) => {
        const sessions = state.sessions.filter(
          (session) => session.host !== host,
        )
        return {
          ...state,
          sessions,
        }
      })
    },
  }),
  {
    persist: {
      name: 'sessions',
      version: 0,
    },
  },
)

export const useSessionsStore = () =>
  useSyncExternalStoreWithTracked(
    sessionsStore.subscribe,
    sessionsStore.getState,
  )
