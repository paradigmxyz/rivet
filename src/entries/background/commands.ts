import { getMessenger } from '~/messengers'

const walletMessenger = getMessenger('background:wallet')

export function handleCommands() {
  chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-theme')
      walletMessenger.send('toggleTheme', undefined)
  })
}
