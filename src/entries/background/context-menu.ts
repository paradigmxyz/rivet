export function setupContextMenu() {
  chrome.runtime.onInstalled.addListener(async () => {
    if (process.env.NODE_ENV === 'development') {
      chrome.contextMenus.create({
        id: 'open-popup',
        title: 'Open Popup in a New Tab',
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
        if (menuItemId === 'open-popup') {
          chrome.tabs.create({
            url: `chrome-extension://${chrome.runtime.id}/src/entries/popup/_app.html`,
          })
        } else if (menuItemId === 'open-design-system') {
          chrome.tabs.create({
            url: `chrome-extension://${chrome.runtime.id}/src/entries/tab/_app.html#/ds`,
          })
        } else if (menuItemId === 'open-test-dapp') {
          chrome.tabs.create({
            url: 'http://localhost:5173',
          })
        }
      })
    } else {
      chrome.tabs.create({
        url: `chrome-extension://${chrome.runtime.id}/tabs/onboard.html`,
      })
    }
  })
}
