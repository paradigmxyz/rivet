export function setupInpage() {
  const manifest = chrome.runtime.getManifest()
  const webAccessibleResources = manifest.web_accessible_resources ?? []
  const js = webAccessibleResources
    .flatMap((x) => (typeof x === 'string' ? x : x.resources))
    .find((path) => path.includes('inpage/'))
  if (!js) return
  chrome.scripting.registerContentScripts([
    {
      id: 'inpage',
      matches: ['file://*/*', 'http://*/*', 'https://*/*'],
      js: [js],
      runAt: 'document_start',
      world: 'MAIN',
    },
  ])
}
