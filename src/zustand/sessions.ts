import { useSyncExternalStoreWithTracked } from '~/hooks/useSyncExternalStoreWithTracked'

import { createStore } from './utils'

type Host = string
type Session = { host: Host }

export type SessionsState = {
  sessions: Record<Host, Session>
}
export type SessionsActions = {
  addSession: ({ session }: { session: Session }) => void
  getSession: ({ host }: { host: Host }) => Session
  getSessions: () => Session[]
  removeSession: ({ host }: { host: Host }) => void
}
export type SessionsStore = SessionsState & SessionsActions

export const sessionsStore = createStore<SessionsStore>(
  (set, get) => ({
    sessions: {},
    addSession({ session }) {
      set((state) => ({
        ...state,
        sessions: {
          ...state.sessions,
          [session.host]: session,
        },
      }))
    },
    getSession({ host }) {
      return get().sessions[host]
    },
    getSessions() {
      return Object.values(get().sessions)
    },
    removeSession({ host }) {
      set((state) => {
        const { [host]: _, ...sessions } = state.sessions
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
