import { settingsStore } from '../../zustand'

export function setupWalletSidebarHandler() {
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === 'openWallet') {
      const { bypassSignatureAuth, bypassTransactionAuth } =
        settingsStore.getState()
      const { method } = message.payload
      if (
        method === 'eth_requestAccounts' ||
        (method === 'eth_sendTransaction' && !bypassTransactionAuth) ||
        (method === 'eth_sign' && !bypassSignatureAuth) ||
        (method === 'eth_signTypedData_v4' && !bypassSignatureAuth) ||
        (method === 'personal_sign' && !bypassSignatureAuth)
      ) {
        chrome.sidePanel.open({ tabId: sender.tab!.id! })
      }
    }
  })
}
