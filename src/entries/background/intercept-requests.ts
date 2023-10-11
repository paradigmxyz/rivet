import { type SessionsStore, networkStore, sessionsStore } from '~/zustand'

const decoder = new TextDecoder('utf-8')

export async function interceptJsonRpcRequests() {
  let id = 0

  function watchRequests({
    redirectUrl,
    sessions,
  }: { redirectUrl: string; sessions: SessionsStore['sessions'] }) {
    const handler = (details: chrome.webRequest.WebRequestBodyDetails) => {
      ;(async () => {
        try {
          const url = new URL(details.url).host
          const initiator = details.initiator
            ? new URL(details.initiator).host
            : undefined

          // Do not add intercept rule if there is no initiator.
          if (!initiator) return
          // Do not add intercept rule that are not JSON-RPC.
          if (!isJsonRpcRequest(details)) return
          // Do not add intercept rule that are coming from the redirect URL.
          if (url === new URL(redirectUrl).host) return
          // Do not add intercept rule that are coming from extensions.
          if (details.initiator?.startsWith('chrome-extension://')) return

          id++

          const initiatorDomain = initiator.includes('localhost')
            ? 'localhost'
            : initiator

          // Extract current rule from the initiator domain.
          const rules = await chrome.declarativeNetRequest.getDynamicRules()
          const rule = rules.find((rule) =>
            rule.condition.initiatorDomains?.includes(initiatorDomain),
          )

          const initiatorAuthorized = sessions.find(
            (x) => x.host === initiator.replace('www.', ''),
          )
          if (initiatorAuthorized) {
            // If rule has already been added (same redirect url), do not add again.
            if (rule?.action.redirect?.url === redirectUrl) return

            // Remove existing rule (that has different redirect url).
            if (rule)
              chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [rule?.id],
              })

            // Add intercept rule for new redirect url.
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
                    initiatorDomains: [initiatorDomain],
                    urlFilter: url,
                    resourceTypes: [
                      chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
                    ],
                  },
                },
              ],
            })
          } else {
            // If rule does not exist, don't need to remove.
            if (!rule) return

            // If initiator is not authorized in the wallet session, remove intercept rule.
            chrome.declarativeNetRequest.updateDynamicRules({
              removeRuleIds: [rule?.id],
            })
          }
        } catch {}
      })()
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

  const sessions = sessionsStore.getState().sessions
  const network = networkStore.getState().network

  let unwatch = watchRequests({
    redirectUrl: network.rpcUrl,
    sessions: sessions,
  })

  // Subscribe to network changes (Anvil RPC URL).
  networkStore.subscribe(async ({ network }) => {
    unwatch()

    // If there is no current RPC URL, do not intercept requests.
    if (!network.rpcUrl) return

    const { sessions } = sessionsStore.getState()

    // Listen for new incoming requests to intercept.
    unwatch = watchRequests({ redirectUrl: network.rpcUrl, sessions })
  })

  // Subscribe to session changes.
  sessionsStore.subscribe(({ sessions }) => {
    unwatch()

    const { network } = networkStore.getState()

    // Listen for new incoming requests to intercept.
    unwatch = watchRequests({ redirectUrl: network.rpcUrl, sessions })
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
  if (!request) return false
  const isJsonRpcRequest = (request as { jsonrpc: string }).jsonrpc === '2.0'
  if (!isJsonRpcRequest) return false
  return true
}
