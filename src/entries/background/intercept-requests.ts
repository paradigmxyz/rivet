import { networkStore } from '~/zustand'

const decoder = new TextDecoder('utf-8')

export async function interceptJsonRpcRequests() {
  let id = 0
  const rulesCache = new Map()

  function watchRequests({ redirectUrl }: { redirectUrl: string }) {
    const handler = (details: chrome.webRequest.WebRequestBodyDetails) => {
      const host = new URL(details.url).host

      // Do not add intercept rule if it has already been added.
      if (rulesCache.get(host)) return
      // Do not intercept requests that are not JSON-RPC.
      if (!isJsonRpcRequest(details)) return
      // Do not intercept requests that are coming from the redirect URL.
      if (host === new URL(redirectUrl).host) return
      // Do not intercept requests that are coming from extensions.
      if (details.initiator?.startsWith('chrome-extension://')) return

      id++

      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id,
            priority: 1,
            action: {
              type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
              redirect: {
                url: redirectUrl,
              },
            },
            condition: {
              urlFilter: host,
              resourceTypes: [
                chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
              ],
            },
          },
        ],
        removeRuleIds: [id],
      })
      rulesCache.set(host, true)
    }

    chrome.webRequest.onBeforeRequest.addListener(
      handler,
      { urls: ['*://*/*'], types: ['xmlhttprequest'] },
      ['requestBody'],
    )
    return () => chrome.webRequest.onBeforeRequest.removeListener(handler)
  }

  // Clear any existing intercept rules.
  const rules = await chrome.declarativeNetRequest.getDynamicRules()
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(({ id }) => id),
  })

  // Subscribe to network changes (Anvil RPC URL).
  networkStore.subscribe(async ({ network }) => {
    // Update existing intercept rules
    const rules = await chrome.declarativeNetRequest.getDynamicRules()
    if (rules.length > 0)
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: network.rpcUrl
          ? rules.map((rule) => ({
              ...rule,
              action: {
                ...rule.action,
                redirect: {
                  url: network.rpcUrl,
                },
              },
            }))
          : [],
        removeRuleIds: rules.map(({ id }) => id),
      })

    // If there is no current RPC URL, do not intercept requests.
    if (!network.rpcUrl) return

    // Listen for new incoming requests to intercept.
    return watchRequests({ redirectUrl: network.rpcUrl })
  })
}

function isJsonRpcRequest(details: chrome.webRequest.WebRequestBodyDetails) {
  const rawBody = details.requestBody?.raw
  if (!rawBody?.[0]) return false

  const json = (() => {
    try {
      return JSON.parse(decodeURIComponent(decoder.decode(rawBody[0].bytes)))
    } catch {}
  })()
  const request = Array.isArray(json) ? json[0] : json
  const isJsonRpcRequest = request?.jsonrpc === '2.0'
  if (!isJsonRpcRequest) return false
  return true
}
