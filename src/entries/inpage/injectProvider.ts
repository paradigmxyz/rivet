import { getMessenger } from '~/messengers'
import { getProvider } from '~/provider'

const backgroundMessenger = getMessenger({ connection: 'background <> inpage' })

export function injectProvider() {
  console.log('injection complete in window')
  window.ethereum = getProvider({ messenger: backgroundMessenger })
  window.dispatchEvent(new Event('ethereum#initialized'))
}
