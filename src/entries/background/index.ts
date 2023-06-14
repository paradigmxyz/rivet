import { handleCommands } from './commands'
import { setupContextMenu } from './context-menu'
import { setupExtensionId } from './extension-id'
import { setupInpage } from './inpage'
import { setupRpcHandler } from './rpc'
import { syncStores } from '~/zustand'

handleCommands()
setupContextMenu()
setupExtensionId()
setupInpage()
setupRpcHandler()
syncStores()
