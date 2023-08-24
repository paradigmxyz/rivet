import type { ReplyMessage, SendMessage, Transport } from './types'
import { isValidReply, isValidSend } from './utils'

let activeTab: chrome.tabs.Tab

function getActiveTabs() {
  if (!chrome.tabs) return Promise.resolve([])
  return chrome.tabs
    .query({ active: true, lastFocusedWindow: true })
    .then(([tab]) => {
      if (!tab?.url?.startsWith('http') && activeTab) return [activeTab]
      activeTab = tab
      return [tab]
    })
}

function sendMessage<TPayload>(
  message: SendMessage<TPayload>,
  { tabId }: { tabId?: number } = {},
) {
  if (!tabId) {
    chrome.runtime.sendMessage(message)
  } else {
    chrome.tabs.sendMessage(tabId, message)
  }
}

/**
 * Creates a "tab transport" that can be used to communicate between
 * scripts where `chrome.tabs` & `chrome.runtime` is defined.
 *
 * Compatible connections:
 * - ❌ Wallet <-> Inpage
 * - ❌ Background <-> Inpage
 * - ✅ Background <-> Wallet
 * - ❌ Wallet <-> Content Script
 * - ❌ Background <-> Content Script
 * - ❌ Content Script <-> Inpage
 */
export const createTabTransport = <TConnection extends string>(
  connection: TConnection,
): Transport<TConnection> => ({
  available: Boolean(
    typeof chrome !== 'undefined' && chrome.runtime?.id && chrome.tabs,
  ),
  connection,
  async send(topic, payload, { id } = {}) {
    return new Promise((resolve, reject) => {
      const listener = (message: ReplyMessage<any>) => {
        if (!isValidReply({ id, message, topic })) return

        chrome.runtime.onMessage.removeListener(listener)

        const { response: response_, error } = message.payload
        if (error) reject(new Error(error.message))
        resolve(response_)
      }
      chrome.runtime.onMessage.addListener(listener)

      getActiveTabs().then(([tab]) => {
        sendMessage({ topic: `> ${topic}`, payload, id }, { tabId: tab?.id })
      })
    })
  },
  reply(topic, callback) {
    const listener = (
      message: SendMessage<any>,
      sender: chrome.runtime.MessageSender,
    ) => {
      if (!isValidSend({ message, topic })) return

      const repliedTopic = message.topic.replace('>', '<')

      getActiveTabs().then(([tab]) => {
        callback(message.payload, {
          id: message.id,
          sender,
          topic: message.topic,
        })
          .then((response) =>
            sendMessage(
              {
                topic: repliedTopic,
                payload: { response },
                id: message.id,
              },
              { tabId: tab?.id },
            ),
          )
          .catch((error_) => {
            // Errors do not serialize properly over `chrome.runtime.sendMessage`, so
            // we are manually serializing it to an object.
            const error: Record<string, unknown> = {}
            for (const key of Object.getOwnPropertyNames(error_)) {
              error[key] = (<Error>error_)[<keyof Error>key]
            }
            sendMessage(
              {
                topic: repliedTopic,
                payload: { error },
                id: message.id,
              },
              {
                tabId: tab?.id,
              },
            )
          })
      })
      return true
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  },
})
