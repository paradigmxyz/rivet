import { v4 as uuidv4 } from '@lukeed/uuid'
import { type EIP1193Provider, announceProvider } from 'mipd'

import { getMessenger } from '~/messengers'
import { getProvider } from '~/provider'

const backgroundMessenger = getMessenger('background:inpage')
const walletMessenger = getMessenger('wallet:inpage')

export function injectProvider() {
  const provider = getProvider({
    host: window.location.host,
    eventMessenger: [walletMessenger, backgroundMessenger],
    requestMessenger: backgroundMessenger,
  })

  // Inject provider directly onto window
  window.ethereum = provider
  window.dispatchEvent(new Event('ethereum#initialized'))

  // Re-inject provider on demand
  walletMessenger.reply('injectProvider', async () => {
    window.ethereum = provider
  })

  // Announce provider
  announceProvider({
    info: {
      icon: 'data:image/svg+xml,<svg width="337" height="337" viewBox="0 0 337 337" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="337" height="337" fill="black"/><path d="M169 72L253.004 120.5V217.5L169 266L84.9955 217.5V120.5L169 72Z" fill="white"/><circle cx="170.054" cy="167.946" r="43.2283" fill="black"/><circle cx="170.054" cy="167.946" r="22.1413" fill="white"/></svg>',
      name: 'Rivet',
      rdns: 'et.riv',
      uuid: uuidv4(),
    },
    provider: provider as EIP1193Provider,
  })
}
