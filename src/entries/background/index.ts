import { getMessenger } from '../../messengers'
import { handleCommands } from './commands'
import { setupContextMenu } from './context-menu'
import { setupExtensionId } from './extension-id'
import { setupInpage } from './inpage'
import { setupRpcHandler } from './rpc'
import { syncStores } from '~/zustand'

getMessenger({ connection: 'background <> contentScript' }).reply(
  'ping',
  async () => 'pong',
)

handleCommands()
setupContextMenu()
setupExtensionId()
setupInpage()
setupRpcHandler()
syncStores()
