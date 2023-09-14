import { getMessenger } from '~/messengers'

const inpageMessenger = getMessenger('background:inpage')

export function setupContextMenu() {
  chrome.action.onClicked.addListener(() => {
    inpageMessenger.send('toggleWallet', undefined)
  })

  // TODO: Only create context menu if selected text is "openable" in Rivet.
  // chrome.contextMenus.create({
  //   id: 'open',
  //   title: 'Open in Rivet',
  //   contexts: ['selection'],
  // })

  if (process.env.NODE_ENV === 'development') {
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
      id: 'open-components',
      title: 'Open Component Playground',
      type: 'normal',
      contexts: ['action'],
    })
    chrome.contextMenus.create({
      id: 'open-test-dapp',
      title: 'Open Test Dapp',
      type: 'normal',
      contexts: ['action'],
    })
  }

  chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
    if (menuItemId === 'open-wallet-tab') {
      chrome.tabs.create({
        url: `chrome-extension://${chrome.runtime.id}/src/index.html`,
      })
    } else if (menuItemId === 'open-design-system') {
      chrome.tabs.create({
        url: `chrome-extension://${chrome.runtime.id}/src/design-system/_playground/index.html`,
      })
    } else if (menuItemId === 'open-components') {
      chrome.tabs.create({
        url: `chrome-extension://${chrome.runtime.id}/src/components/_playground/index.html`,
      })
    } else if (menuItemId === 'open-test-dapp') {
      chrome.tabs.create({
        url: 'http://localhost:5173',
      })
    }
    // TODO: Match selected text.
    // } else if (menuItemId === 'open') {
    //   inpageMessenger.send('toggleWallet', {
    //     open: true,
    //     route: `/transaction/${selectionText}`,
    //   })
    // }
  })
}
