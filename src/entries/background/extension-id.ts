import { createMessenger } from '~/messengers'

export function setupExtensionId() {
  const messenger = createMessenger({ connection: 'background <> inpage' })
  messenger.reply('extensionId', async () => chrome.runtime.id)
}
