import { EventEmitter } from 'eventemitter3'

class WindowProvider extends EventEmitter {
  async request(): Promise<any> {
    return '0x1'
  }
}

if (shouldInjectProvider()) {
  console.log('injection complete in window')
  window.ethereum = new WindowProvider()
  window.dispatchEvent(new Event('ethereum#initialized'))
}

/**
 * Determines if the provider should be injected
 */
function shouldInjectProvider() {
  return doctypeCheck() && suffixCheck() && documentElementCheck()
}

/**
 * Checks the doctype of the current document if it exists
 */
function doctypeCheck() {
  const { doctype } = window.document
  if (doctype) return doctype.name === 'html'
  return true
}

/**
 * Returns whether or not the extension (suffix) of the current document is prohibited
 *
 * This checks {@code window.location.pathname} against a set of file extensions
 * that we should not inject the provider into. This check is indifferent of
 * query parameters in the location.
 */
function suffixCheck() {
  const prohibitedTypes = [/\.xml$/u, /\.pdf$/u]
  const currentUrl = window.location.pathname
  for (let i = 0; i < prohibitedTypes.length; i++)
    if (prohibitedTypes[i].test(currentUrl)) return false
  return true
}

/**
 * Checks the documentElement of the current document
 */
function documentElementCheck() {
  const documentElement = document.documentElement.nodeName
  if (documentElement) documentElement.toLowerCase() === 'html'
  return true
}
