import { getMessenger } from '~/messengers'

export function setupExtensionId() {
  const messenger = getMessenger('background:contentScript')
  messenger.reply('extensionId', async () => chrome.runtime.id)
}
