export function setupInpage() {
  chrome.scripting.registerContentScripts([
    {
      id: 'inpage',
      matches: ['file://*/*', 'http://*/*', 'https://*/*'],
      js: ['src/entries/inpage/index.js'],
      runAt: 'document_start',
      world: 'MAIN',
    },
  ])
}
