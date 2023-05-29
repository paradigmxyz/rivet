import { getMessenger } from '~/messengers'

export function setupExtensionId() {
  const messenger = getMessenger({ connection: 'background <> inpage' })
  messenger.reply('extensionId', async () => chrome.runtime.id)
}
