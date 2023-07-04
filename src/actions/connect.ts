import { numberToHex } from 'viem'
import type { Messenger } from '~/messengers'
import { networkStore, sessionsStore } from '~/zustand'

export async function connect({
  host,
  messenger,
}: { host: string; messenger: Messenger }) {
  const { network } = networkStore.getState()

  const { addSession } = sessionsStore.getState()
  addSession({ session: { host } })

  await messenger.send('connect', { chainId: numberToHex(network.chainId) })
}
