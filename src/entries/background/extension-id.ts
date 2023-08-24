import { getMessenger } from '~/messengers'

export function setupExtensionId() {
  const messenger = getMessenger('background:inpage')
  messenger.reply('extensionId', async () => chrome.runtime.id)
}
