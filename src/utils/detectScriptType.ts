/**
 * Detects and returns what context the script is in.
 */
export function detectScriptType() {
  const hasChromeRuntime = typeof chrome !== 'undefined' && chrome.runtime
  const hasWindow = typeof window !== 'undefined'

  if (hasChromeRuntime && hasWindow) {
    if (window.location.pathname.includes('background')) return 'background'
    if (window.location.pathname.includes('contentscript'))
      return 'contentScript'
    if (window.location.pathname.includes('popup')) return 'popup'
    return 'contentScript'
  }
  if (hasChromeRuntime && !hasWindow) return 'background'
  if (!hasChromeRuntime && hasWindow) return 'inpage'
  throw new Error('Undetected script.')
}

export type ScriptType = ReturnType<typeof detectScriptType>
