import { getMessenger } from '~/messengers'
import { setupBridgeTransportRelay } from '~/messengers/transports/bridge'

setupBridgeTransportRelay()

const backgroundMessenger = getMessenger('background:contentScript')
backgroundMessenger.send('ping', undefined)
setInterval(() => {
  backgroundMessenger.send('ping', undefined)
}, 5000)

window.addEventListener('message', ({ data }) => {
  if (data.type === 'openWallet') chrome.runtime.sendMessage(data)
})
