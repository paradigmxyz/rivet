import type { Messenger } from '~/messengers'
import { sessionsStore } from '~/zustand'

export async function disconnect({
  host,
  messenger,
}: { host: string; messenger: Messenger }) {
  const { removeSession } = sessionsStore.getState()
  removeSession({ host })

  await messenger.send('disconnect', undefined)
}
