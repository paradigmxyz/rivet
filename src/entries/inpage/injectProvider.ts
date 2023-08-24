import { v4 as uuidv4 } from '@lukeed/uuid'
import { announceProvider } from 'mipd'

import { getMessenger } from '~/messengers'
import { getProvider } from '~/provider'

const backgroundMessenger = getMessenger('background:inpage')

export function injectProvider() {
  const provider = getProvider({
    host: window.location.host,
    messenger: backgroundMessenger,
  })

  // Inject provider directly onto window
  window.ethereum = provider
  window.dispatchEvent(new Event('ethereum#initialized'))

  // Announce provider
  announceProvider({
    info: {
      icon: '',
      name: 'Rivet',
      rdns: 'et.riv',
      uuid: uuidv4(),
    },
    provider,
  })
}
