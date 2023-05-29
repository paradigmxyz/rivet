import { getMessenger } from '~/messengers'

const inpageMessenger = getMessenger({
  connection: 'background <> inpage',
})

export function setupContextMenu() {
  if (process.env.NODE_ENV === 'development') {
    chrome.contextMenus.create({
      id: 'open-wallet',
      title: 'Open Wallet',
      type: 'normal',
      contexts: ['action'],
    })
    chrome.contextMenus.create({
      id: 'open-wallet-tab',
      title: 'Open Wallet in a New Tab',
      type: 'normal',
      contexts: ['action'],
    })
    chrome.contextMenus.create({
      id: 'open-design-system',
      title: 'Open Design System',
      type: 'normal',
      contexts: ['action'],
    })
    chrome.contextMenus.create({
      id: 'open-test-dapp',
      title: 'Open Test Dapp',
      type: 'normal',
      contexts: ['action'],
    })

    chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
      if (menuItemId === 'open-wallet') {
        inpageMessenger.send('toggleWallet', { open: true })
      } else if (menuItemId === 'open-wallet-tab') {
        chrome.tabs.create({
          url: `chrome-extension://${chrome.runtime.id}/src/index.html`,
        })
      } else if (menuItemId === 'open-design-system') {
        chrome.tabs.create({
          url: `chrome-extension://${chrome.runtime.id}/src/design-system/playground/index.html`,
        })
      } else if (menuItemId === 'open-test-dapp') {
        chrome.tabs.create({
          url: 'http://localhost:5173',
        })
      }
    })
  }
}
