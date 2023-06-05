export function setupInpage() {
  chrome.scripting.registerContentScripts([
    {
      id: 'inpage',
      matches: ['file://*/*', 'http://*/*', 'https://*/*'],
      js: ['inpage.js'],
      runAt: 'document_start',
      world: 'MAIN',
    },
  ])
}
