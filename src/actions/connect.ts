import { type Address, numberToHex } from 'viem'
import type { Messenger } from '~/messengers'
import { accountStore, networkStore, sessionsStore } from '~/zustand'

export async function connect({
  host,
  messenger,
}: { host: string; messenger: Messenger }) {
  const { accountsForRpcUrl } = accountStore.getState()
  const { network } = networkStore.getState()
  const accounts = accountsForRpcUrl({ rpcUrl: network.rpcUrl })

  const addresses = accounts.map((x) => x.address) as Address[]

  const { addSession } = sessionsStore.getState()
  addSession({ session: { host, addresses } })

  await messenger.send('connect', { chainId: numberToHex(network.chainId) })
}
