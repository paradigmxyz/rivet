import type { ReplyMessage, SendMessage } from './types'

export function isValidReply<TResponse>({
  id,
  topic,
  message,
}: {
  id?: number | string
  topic: string
  message: ReplyMessage<TResponse>
}) {
  if (message.topic !== `< ${topic}`) return false
  if (!message.payload) return false
  if (typeof id !== 'undefined' && message.id !== id) return false
  return true
}

export function isValidSend({
  topic,
  message,
  options,
}: {
  topic: string
  message: SendMessage<unknown>
  options?: { connection?: string }
}) {
  if (!message.topic) return false
  if (
    options?.connection &&
    message.connection &&
    message.connection !== options.connection
  )
    return false
  if (topic !== '*' && message.topic !== `> ${topic}`) return false
  if (topic === '*' && message.topic.startsWith('<')) return false
  return true
}
